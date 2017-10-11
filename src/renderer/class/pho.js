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
      await store.dispatch('user/setAuthData', authRes)
      await this.api.accountVerifyCredentials()
      this.isAuthed = true
      return true
    } catch (err) {
      // auth failed
      this.errorHandler(err)
      return false
    }
  }

  logout () {
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
      this.errorHandler(err)
      return false
    }
  }

  pollHome () {
    clearInterval(this.homePoller)
    this.homePoller = setInterval(() => {
      this.fetchHome({append: true})
    }, this.homePollerInterval || 15 * 1000)
  }

  async toggleFav (currentFavState, msgId) {
    if (!this.isAuthed) return false
    try {
      if (currentFavState === false) {
        await this.api.favoritesCreate(msgId)
      } else {
        await this.api.favoritesDestroy(msgId)
      }
      return true
    } catch (err) {
      this.errorHandler(err)
      return false
    }
  }

  errorHandler (error) {
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
