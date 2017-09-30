import store from '../store'
import fs from 'fs'
import FanfouSdk from 'fanfou-sdk'
let fanfou = null

function doAuth (username, password) {
  let oauthToken = store.state.user.authData.oauth_token || ''
  let oauthTokenSecret = store.state.user.authData.oauth_token_secret || ''

  if (typeof oauthToken === 'string' && oauthToken.length > 0 && typeof oauthTokenSecret === 'string' && oauthTokenSecret.length > 0) {
    fanfou = new FanfouSdk({
      auth_type: 'oauth',
      consumer_key: store.state.config.consumer_key,
      consumer_secret: store.state.config.consumer_secret,
      oauth_token: oauthToken,
      oauth_token_secret: oauthTokenSecret
    })
  } else if (username && password) {
    fanfou = new FanfouSdk({
      auth_type: 'xauth',
      consumer_key: store.state.config.consumer_key,
      consumer_secret: store.state.config.consumer_secret,
      username: username,
      password: password
    })
  } else {
    return false
  }

  return true
}

export default {
  auth (username, password) {
    if (!fanfou && !doAuth(username, password)) {
      throw new Error('fanfou instance not ready, could not exec <auth>')
    }

    return new Promise((resolve, reject) => {
      if (fanfou.auth_type === 'oauth') {
        return resolve('authed')
      } else {
        fanfou.xauth((err, res) => {
          if (err) {
            return reject(err)
          } else {
            store.dispatch('setAuthData', {
              oauth_token: res.oauth_token,
              oauth_token_secret: res.oauth_token_secret
            })
            return resolve('authed')
          }
        })
      }
    })
  },

  unauth () {
    fanfou = null
    store.dispatch('unsetAuthData')
  },

  get (url, param) {
    store.dispatch('setShowLoading', true)
    if (!fanfou && !doAuth()) {
      throw new Error('fanfou instance not ready, could not exec <get> to ' + url)
    }
    return new Promise((resolve, reject) => {
      fanfou.get(url, param, function (err, res, data) {
        store.dispatch('setShowLoading', false)
        if (err) {
          return reject(err)
        } else {
          return resolve(res)
        }
      })
    })
  },

  post (url, param) {
    store.dispatch('setShowLoading', true)
    if (!fanfou && !doAuth()) {
      throw new Error('fanfou instance not ready, could not exec <post> to ' + url)
    }
    return new Promise((resolve, reject) => {
      fanfou.post(url, param, function (err, res, data) {
        store.dispatch('setShowLoading', false)
        if (err) {
          return reject(err)
        } else {
          return resolve(res)
        }
      })
    })
  },

  upload (image, status) {
    store.dispatch('setShowLoading', true)
    if (!fanfou && !doAuth()) {
      throw new Error('fanfou instance not ready, could not exec <upload>')
    }
    return new Promise((resolve, reject) => {
      fanfou.upload(fs.createReadStream(image), status, function (err, res, data) {
        store.dispatch('setShowLoading', false)
        if (err) {
          return reject(err)
        } else {
          return resolve(res)
        }
      })
    })
  },

  getPublicTimeline () {
    this.get('/statuses/public_timeline', {count: 60, format: 'html'})
      .then(res => {
        store.dispatch('appendToHomeTimeline', res)
      })
      .catch(err => console.error(err))
  },

  getHomeTimeline (isAppend, callback) {
    let sinceId = store.getters.since_id
    this.get('/statuses/home_timeline', {since_id: sinceId, count: 60, format: 'html'})
      .then(res => {
        store.dispatch('appendToHomeTimeline', {isAppend, res})
          .then(() => {
            if (typeof callback === 'function') callback()
          })
      })
      .catch(err => console.error(err))
  },

  getMoreHomeTimeline (callback) {
    let maxId = store.getters.max_id
    this.get('/statuses/home_timeline', {max_id: maxId, count: 61, format: 'html'})
      .then(res => {
        store.dispatch('appendToHomeTimeline', {isLoadMore: true, res: res})
          .then(() => {
            if (typeof callback === 'function') callback()
          })
      })
      .catch(err => console.error(err))
  },

  sendNewStatus (text, args) {
    let status = (typeof text !== 'undefined') ? text.toString() : null
    if (typeof status !== 'string' || status.length === 0) {
      return Promise.reject(new Error('cannot post empty status'))
    } else {
      let options = {
        status: status
      }
      if (args.inReplyToStatusId) options.in_reply_to_status_id = args.inReplyToStatusId
      if (args.inReplyToUserId) options.in_reply_to_user_id = args.inReplyToUserId
      if (args.repostStatusId) options.repost_status_id = args.repostStatusId
      return this.post('/statuses/update', options)
    }
  },

  sendNewPhoto (text, imageFilePath) {
    let status = text
    let image = imageFilePath
    if (typeof image !== 'string' || image.length === 0) {
      return Promise.reject(new Error('cannot post empty photo'))
    } else {
      if (typeof status !== 'string') status = ''
      return this.upload(image, status)
    }
  },

  setFav (statusId) {
    return this.post('/favorites/create/' + statusId)
  },

  unsetFav (statusId) {
    return this.post('/favorites/destroy/' + statusId)
  }
}
