import store from './../store'
import API from './../api'

class Pho {
  constructor () {
    this.api = new API()
    this.consumerKey = store.state.app.consumerKey
    this.consumerSecret = store.state.app.consumerSecret
    this.oauthToken = store.state.user.authData.oauth_token || ''
    this.oauthTokenSecret = store.state.user.authData.oauth_token_secret || ''

    // try to auto login
    this.attemptAutoLogin()
  }

  async attemptAutoLogin () {
    if (this.oauthToken && this.oauthTokenSecret) {
      this.api.auth({
        type: 'oauth',
        consumerInfo: [this.consumerKey, this.consumerSecret],
        authInfo: [this.oauthToken, this.oauthTokenSecret]
      })

      try {
        await this.api.accountVerifyCredentials()
        // auth was fine
      } catch (err) {
        // auth failed
        // should show login view
        this.logout()
      }
    } else {
      // not enough info for auth
      // should show login view
      this.logout()
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
      // auth was fine
    } catch (err) {
      // auth failed
      throw err
    }
  }

  logout () {
    store.dispatch('user/unsetAuthData')
  }

  async fetchHome () {
    try {
      const data = await this.api.statusesHomeTimeline()
      store.dispatch('timelineHome/appendToHomeTimeline', {
        data,
        isLoadMore: false,
        isAppend: false
      })
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}

export default Pho
