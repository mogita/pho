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
    if (!this.oauthToken || !this.oauthTokenSecret) this.logout()

    this.api.auth({
      type: 'oauth',
      consumerInfo: [this.consumerKey, this.consumerSecret],
      authInfo: [this.oauthToken, this.oauthTokenSecret]
    })

    try {
      await this.api.accountVerifyCredentials()
      this.isAuthed = true
      return true
    } catch (err) {
      // auth failed
      if (!(err instanceof PhoNetworkError)) {
        // should show login view if not a network error
        this.logout()
      } else {
        this.errorHandler(err)
      }
      return false
    }
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
      window.dispatchEvent(new CustomEvent('toast', {detail: {type: 'danger', title: '错误', message: error.message}}))
    } else if (error instanceof PhoNetworkError) {
      window.dispatchEvent(new CustomEvent('toast', {detail: {type: 'danger', title: '网络错误', message: error.message}}))
    } else if (error instanceof PhoAuthError) {
      window.dispatchEvent(new CustomEvent('toast', {detail: {type: 'danger', title: '认证错误', message: error.message}}))
    } else {
      window.dispatchEvent(new CustomEvent('toast', {detail: {type: 'danger', title: '错误', message: error.message}}))
    }
  }
}

export default Pho
