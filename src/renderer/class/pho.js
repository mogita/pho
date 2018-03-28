import { ipcRenderer, shell } from 'electron'
import store from './../store'
import API from './../api'
import {PhoRuntimeError, PhoNetworkError, PhoAuthError} from './error'

class Pho {
  constructor () {
    this.api = new API()
    this.isAuthed = false
    this.consumerKey = store.state.app.consumerKey
    this.consumerSecret = store.state.app.consumerSecret
    this.oauthToken = store.state.user.authData.oauth_token || ''
    this.oauthTokenSecret = store.state.user.authData.oauth_token_secret || ''

    this.homePoller = null
    this.homePollerInterval = 20 * 1000

    this.mentionPoller = null
    this.mentionPollerInterval = 20 * 1000

    ipcRenderer.on('user.logout', this.logout)
    ipcRenderer.on('user.login', this.setAuthData)
  }

  async setAuthData (event, args) {
    await store.dispatch('user/setAuthData', args)
  }

  async attemptAutoLogin () {
    // do clearance on insufficient auth info
    if (!this.oauthToken || !this.oauthTokenSecret) {
      this.logout()
      return false
    }

    this.api.auth({
      type: 'oauth',
      consumerInfo: [this.consumerKey, this.consumerSecret],
      authInfo: [this.oauthToken, this.oauthTokenSecret]
    })

    this.isAuthed = true
    return true
  }

  async login (username, password) {
    try {
      const authRes = await this.api.auth({
        type: 'xauth',
        consumerInfo: [this.consumerKey, this.consumerSecret],
        authInfo: [username, password]
      })
      ipcRenderer.send('user.login', authRes)
      this.setAuthData(null, authRes)
      await this.api.accountVerifyCredentials()
      this.isAuthed = true
      return true
    } catch (err) {
      // auth failed
      this.handleError(err)
      return false
    }
  }

  logout () {
    ipcRenderer.send('user.logout')
    store.dispatch('timelineHome/reset')
    store.dispatch('timelineMention/reset')
    store.dispatch('user/unsetAuthData')
  }

  async fetchHome (args = {more: false, append: false}) {
    if (!this.isAuthed) return false
    try {
      const maxId = args.more ? store.getters['timelineHome/maxId'] : null
      const sinceId = args.append ? store.getters['timelineHome/sinceId'] : null
      const data = await this.api.statusesHomeTimeline(null, sinceId, maxId)
      store.dispatch('timelineHome/appendToHomeTimeline', {
        data,
        isLoadMore: args.more,
        isAppend: args.append
      })
      return true
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  pollHome () {
    clearInterval(this.homePoller)
    this.homePoller = setInterval(() => {
      this.fetchHome({append: true})
    }, this.homePollerInterval || 20 * 1000)
  }

  async fetchMention (args = {more: false, append: false}) {
    if (!this.isAuthed) return false
    try {
      const maxId = args.more ? store.getters['timelineMention/maxId'] : null
      const sinceId = args.append ? store.getters['timelineMention/sinceId'] : null
      const data = await this.api.statusesMentions(sinceId, maxId)
      store.dispatch('timelineMention/appendToTimelineMention', {
        data,
        isLoadMore: args.more,
        isAppend: args.append
      })
      return true
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  pollMention () {
    clearInterval(this.mentionPoller)
    this.mentionPoller = setInterval(() => {
      this.fetchMention({append: true})
    }, this.mentionPollerInterval || 20 * 1000)
  }

  async fetchSearch (args = {more: false}) {
    if (!this.isAuthed) return false
    try {
      const data = await this.api.searchPublicTimeline(args.keyword)
      return data
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async fetchUserStatuses (args = {more: false}) {
    if (!this.isAuthed) return false
    try {
      const data = await this.api.statusesUserTimeline(args.id)
      return data
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async toggleFav (currentFavState, msgId) {
    if (!this.isAuthed) return false
    try {
      if (currentFavState === false) {
        await this.api.favoritesCreate(msgId)
      } else {
        await this.api.favoritesDestroy(msgId)
      }
      store.dispatch('timelineHome/alterFav', msgId)
      return true
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async deleteStatus (msgId) {
    if (!msgId) return false
    try {
      await this.api.statusesDestroy(msgId)
      return true
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async sendNewStatus (args) {
    if (!this.isAuthed) return false
    try {
      await this.api.statusesUpdate(
        args.status,
        args.inReplyToStatusId,
        args.inReplyToUserId,
        args.repostStatusId,
        args.location
      )
      return true
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async sendNewPhoto (status, imageFilePath) {
    if (!imageFilePath) return false
    if (typeof status === 'undefined') status = ''
    try {
      await this.api.photosUpload(imageFilePath, status)
      return true
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async updateAvatar (imageFilePath) {
    if (!imageFilePath) return false
    try {
      await this.api.avatarUpload(imageFilePath)
      return true
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async getUserProfile (id) {
    if (!id) return false
    try {
      const profile = await this.api.usersShow(id)
      return profile
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async getUserTimeline (id, count = 20) {
    if (!id) return false
    try {
      const res = await this.api.statusesUserTimeline(id, null, null, count)
      return res
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async getTrendsList () {
    try {
      const res = await this.api.trendsList()
      return res
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async getSavedSearchesList () {
    try {
      const res = await this.api.savedSearchesList()
      return res
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  async deleteSavedSearch (id) {
    if (!id) return false
    try {
      await this.api.savedSearchesDestroy(id)
      return true
    } catch (err) {
      this.handleError(err)
      return false
    }
  }

  openExternalLink (url) {
    shell.openExternal(url, {activate: false})
  }

  handleError (error) {
    /* global CustomEvent */
    if (error instanceof PhoRuntimeError) {
      this.toast('danger', '错误', error.message)
    } else if (error instanceof PhoNetworkError) {
      this.toast('danger', '网络错误', error.message)
    } else if (error instanceof PhoAuthError) {
      this.logout()
      this.toast('danger', '认证错误', error.message)
    } else {
      this.toast('danger', '错误', error.message)
    }
  }

  toast (type, title, message) {
    window.dispatchEvent(new CustomEvent('toast', {detail: {type, title, message}}))
  }
}

export default Pho
