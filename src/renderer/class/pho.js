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

  async fetchHome () {
    if (!this.isAuthed) return false
    try {
      const data = await this.api.statusesHomeTimeline()
      store.dispatch('timelineHome/appendToHomeTimeline', {
        data,
        isLoadMore: false,
        isAppend: false
      })
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
