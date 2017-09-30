import fs from 'fs'
import FanfouSdk from 'fanfou-sdk'

class API {
  /**
   * Creates an instance of API.
   *
   * ConsumerInfo should contain [consumer_key, consumer_secret]
   *
   * Supports both "OAuth" and "XAuth"
   * When using OAuth, authInfo should contain [oauth_token, oauth_token_secret]
   * When using XAuth, authInfo should contain [username, password]
   *
   * @param {object} [auth={type: 'oauth', consumerInfo: ['', ''], authInfo: ['', '']}]
   * @memberof API
   */
  constructor (auth = {type: 'oauth', consumerInfo: ['', ''], authInfo: ['', '']}) {
    this.ff = new FanfouSdk({
      auth_type: auth.type,
      consumer_key: auth.consumerInfo[0],
      consumer_secret: auth.consumerInfo[1],
      oauth_token: auth.authInfo[0],
      oauth_token_secret: auth.authInfo[1],
      username: auth.authInfo[0],
      password: auth.authInfo[1]
    })
  }

  /**
   * Promisified Fanfou get method
   *
   * @param {string} [url='']
   * @param {any} [param={}]
   * @returns
   * @memberof API
   */
  get (url = '', param = {}) {
    return new Promise((resolve, reject) => {
      if (!this.ff) return reject(new Error('fanfou instance not ready, could not exec <get> to ' + url))
      this.ff.get(url, param, function (err, res, data) {
        if (err) return reject(err)
        else return resolve(res)
      })
    })
  }

  /**
   * Promisified Fanfou post method
   *
   * @param {string} [url='']
   * @param {any} [param={}]
   * @returns
   * @memberof API
   */
  post (url = '', param = {}) {
    return new Promise((resolve, reject) => {
      if (!this.ff) return reject(new Error('fanfou instance not ready, could not exec <post> to ' + url))
      this.ff.post(url, param, function (err, res, data) {
        if (err) return reject(err)
        else return resolve(res)
      })
    })
  }

  /**
   * Promisified Fanfou upload method
   *
   * @param {string} [photo='']
   * @param {string} [status='']
   * @param {string} [location=''] (todo: currently not supported by sdk)
   * @returns
   * @memberof API
   */
  upload (photo = '', status = '', location = '') {
    return new Promise((resolve, reject) => {
      if (!this.ff) return reject(new Error('fanfou instance not ready, could not exec <upload>'))
      this.ff.upload(fs.createReadStream(photo), status, function (err, res, data) {
        if (err) return reject(err)
        else return resolve(res)
      })
    })
  }

  purgeParam (args) {
    // snippet edit from https://stackoverflow.com/a/46451724/1234151
    return args instanceof Object ? Object.entries(args).reduce((o, [k, v]) => {
      if (typeof v === 'boolean' || typeof v === 'number' || typeof v === 'string' || v) o[k] = this.purgeParam(v)
      return o
    }, args instanceof Array ? [] : {}) : args
  }

  /****************************************
   * SEARCH
   ****************************************/

  /**
   * 搜索全站消息（未设置隐私用户的消息）
   *
   * @param {string} [q=null]
   * @param {string} [sinceId=null]
   * @param {stringany} [maxId=null]
   * @param {number} [count=60]
   * @returns
   * @memberof API
   */
  async searchPublicTimeline (q = null, sinceId = null, maxId = null, count = 20) {
    return await this.get('/search/public_timeline', this.purgeParam({q, since_id: sinceId, max_id: maxId, count}))
  }

  /**
   * 搜索全站用户（只返回其中未被 ban 掉的用户）
   *
   * @param {string} [q=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async searchUsers (q = null, count = 20, page = 1) {
    return await this.get('/search/users', this.purgeParam({q, count, page}))
  }

  /**
   * 搜索指定用户消息
   * 返回的结果中搜索关键字会使用 html 标签区分出来
   *
   * @param {string} [q=null]
   * @param {string} [id=null]
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @returns
   * @memberof API
   */
  async searchUserTimeline (q = null, id = null, sinceId = null, maxId = null, count = 20) {
    return await this.get('/search/user_timeline', this.purgeParam({q, id, since_id: sinceId, max_id: maxId, count}))
  }

  /****************************************
   * BLOCKS
   ****************************************/

  /**
   * 获取用户黑名单 id 列表
   *
   * @returns
   * @memberof API
   */
  async blocksIds () {
    return await this.get('/blocks/ids')
  }

  /**
   * 获取黑名单上用户资料
   *
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async blocksBlocking (count = 20, page = 1) {
    return await this.get('/blocks/blocking', this.purgeParam({count, page}))
  }

  /**
   * 把指定 id 用户加入黑名单
   *
   * @param {any} [id=null]
   * @returns
   * @memberof API
   */
  async blocksCreate (id = null) {
    return await this.post('/blocks/create', this.purgeParam({id}))
  }

  /**
   * 检查用户是否被加入了黑名单
   *
   * @param {any} [id=null]
   * @returns
   * @memberof API
   */
  async blocksExists (id = null) {
    return await this.get('/blocks/exists', this.purgeParam({id}))
  }

  /**
   * 将指定 id 用户解除黑名单
   *
   * @param {any} [id=null]
   * @returns
   * @memberof API
   */
  async blocksDestroy (id = null) {
    return await this.post('/blocks/destroy', this.purgeParam({id}))
  }

  /****************************************
   * USER
   ****************************************/

  /**
   * 返回标记为指定标签的用户列表
   *
   * @param {string} [tag=null]
   * @param {number} [count=100]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async usersTagged (tag = null, count = 100, page = 1) {
    return await this.get('/users/tagged', this.purgeParam({tag, count, page}))
  }

  /**
   * 返回好友或未设置隐私用户的信息
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async usersShow (id = null) {
    return await this.get('/users/show', this.purgeParam({id}))
  }

  /**
   * 获取用户标签列表
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async usersTagList (id = null) {
    return await this.get('/users/tag_list', this.purgeParam({id}))
  }

  /**
   * 返回用户的最近登录的关注者
   *
   * @param {string} [id=null]
   * @param {number} [count=100]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async usersFollowers (id = null, count = 100, page = 1) {
    return await this.get('/users/followers', this.purgeParam({id, count, page}))
  }

  /**
   * 返回系统推荐的好友
   *
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async usersRecommendation (count = 20, page = 1) {
    return await this.get('/2/users/recommendation', this.purgeParam({count, page}))
  }

  /**
   * 忽略系统推荐的好友
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async usersCancelRecommendation (id = null) {
    return await this.post('/2/users/cancel_recommendation', this.purgeParam({id}))
  }

  /**
   * 返回最近登录的用户好友
   *
   * @param {string} [id=null]
   * @param {number} [count=100]
   * @returns
   * @memberof API
   */
  async usersFriends (id = null, count = 100) {
    return await this.get('/users/friends', this.purgeParam({id, count}))
  }

  /****************************************
   * ACCOUNT
   ****************************************/

  /**
   * 检查用户名密码是否正确
   *
   * @returns
   * @memberof API
   */
  async accountVerifyCredentials () {
    return await this.get('/account/verify_credentials')
  }

  /**
   * 通过 API 更新用户头像
   *
   * @param {string} [image=null]
   * @returns
   * @memberof API
   */
  async accountUpdateProfileImage (image = null) {
    return await this.post('/account/update_profile_image', this.purgeParam({image}))
  }

  /**
   * 获取 API 限制
   *
   * @returns
   * @memberof API
   */
  async accountRateLimitStatus () {
    return await this.get('/account/rate_limit_status')
  }

  /**
   * 通过 API 更新用户资料
   *
   * @param {string} [url=null]
   * @param {string} [location=null]
   * @param {string} [description=null]
   * @param {string} [name=null]
   * @param {string} [email=null]
   * @returns
   * @memberof API
   */
  async accountUpdateProfile (url = null, location = null, description = null, name = null, email = null) {
    return await this.post('/account/update_profile', this.purgeParam({url, location, description, name, email}))
  }

  /**
   * 返回未读的 mentions、direct message 以及关注请求数量
   *
   * @returns
   * @memberof API
   */
  async accountNotification () {
    return await this.get('/account/notification')
  }

  /**
   * 向饭否更新当前 app 上的新提醒数量
   * 这个数字会在 http://fanfou.com/settings/apps 应用名字后面用括号标示
   *
   * @param {number} [notifyNum=0]
   * @returns
   * @memberof API
   */
  async accountUpdateNotifyNum (notifyNum = 0) {
    return await this.post('/account/update_notify_num', this.purgeParam({notify_num: notifyNum}))
  }

  /**
   * 获取当前 app 上的新提醒数量
   * 这个数字会在 http://fanfou.com/settings/apps 应用名字后面用括号标示
   *
   * @returns
   * @memberof API
   */
  async accountNotifyNum () {
    return await this.get('/account/notify_num')
  }

  /****************************************
   * SAVED SEARCHES
   ****************************************/

  /**
   * 收藏搜索关键字
   *
   * @param {string} [query=null]
   * @returns
   * @memberof API
   */
  async savedSearchesCreate (query = null) {
    return await this.post('/saved_searches/create', this.purgeParam({query}))
  }

  /**
   * 删除收藏的搜索关键字
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async savedSearchesDestroy (id = null) {
    return await this.post('/saved_searches/destroy', this.purgeParam({id}))
  }

  /**
   * 返回搜索关键字的详细信息
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async savedSearchesShow (id = null) {
    return await this.get('/saved_searches/show', this.purgeParam({id}))
  }

  /**
   * 列出登录用户保存的搜索关键字
   *
   * @returns
   * @memberof API
   */
  async savedSearchesList () {
    return await this.get('/saved_searches/list')
  }

  /****************************************
   * PHOTOS
   ****************************************/

  /**
   * 浏览指定用户的图片
   *
   * @param {string} [id=null]
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async photosUserTimeline (id = null, sinceId = null, maxId = null, count = 20, page = 1) {
    return await this.get('/photos/user_timeline', this.purgeParam({id, since_id: sinceId, max_id: maxId, count, page}))
  }

  /**
   * 上传图片
   *
   * @param {string} [photo=null]
   * @param {string} [status=null]
   * @param {string} [location=null]
   * @returns
   * @memberof API
   */
  async photosUpload (photo = null, status = null, location = null) {
    return await this.upload(photo, status, location)
  }

  /****************************************
   * TRENDS
   ****************************************/

  /**
   * 列出饭否热门话题
   *
   * @returns
   * @memberof API
   */
  async trendsList () {
    return await this.get('/trends/list')
  }

  /****************************************
   * FOLLOWERS
   ****************************************/

  /**
   * 返回用户关注者的 id 列表
   *
   * @param {string} [id=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async followersIds (id = null, count = 20, page = 1) {
    return await this.get('/followers/ids', this.purgeParam({id, count, page}))
  }

  /****************************************
   * FAVORITES
   ****************************************/

  /**
   * 取消收藏指定消息（当前用户的收藏）
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async favoritesDestroy (id = null) {
    return await this.post('/favorites/destroy', this.purgeParam({id}))
  }

  /**
   * 浏览指定用户收藏消息（未设置隐私用户或登录用户好友）
   *
   * @param {string} [id=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async favorites (id = null, count = 20, page = 1) {
    return await this.get('/favorites', this.purgeParam({id, count, page}))
  }

  /**
   * 收藏消息（当前用户关注者和未设置隐私用户发出的消息）
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async favoritesCreate (id = null) {
    return await this.post('/favorites/create', this.purgeParam({id}))
  }

  /****************************************
   * FRIENDSHIPS
   ****************************************/

  /**
   * 添加用户为好友
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async friendshipsCreate (id = null) {
    return await this.post('/friendships/create', this.purgeParam({id}))
  }

  /**
   * 取消关注好友
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async friendshipsDestroy (id = null) {
    return await this.post('/friendships/destroy', this.purgeParam({id}))
  }

  /**
   * 查询 Follow 请求
   *
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async friendshipsRequests (count = 20, page = 1) {
    return await this.get('/friendships/requests', this.purgeParam({count, page}))
  }

  /**
   * 拒绝好友请求
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async friendshipsDeny (id = null) {
    return await this.post('/friendships/deny', this.purgeParam({id}))
  }

  /**
   * 查询两个用户之间是否有 follow 关系
   * 如果 user_a 关注 user_b 则返回 true，否则返回 false
   *
   * @param {string} [userA=null]
   * @param {string} [userB=null]
   * @returns
   * @memberof API
   */
  async friendshipsExists (userA = null, userB = null) {
    return await this.get('/friendships/exists', this.purgeParam({user_a: userA, user_b: userB}))
  }

  /**
   * 接受好友请求
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async friendshipsAccept (id = null) {
    return await this.post('/friendships/accept', this.purgeParam({id}))
  }

  /**
   * 返回两个用户之间 follow 关系的详细信息
   *
   * @param {string} [sourceLoginName=null]
   * @param {string} [targetLoginName=null]
   * @param {string} [sourceId=null]
   * @param {string} [targetId=null]
   * @returns
   * @memberof API
   */
  async friendshipsShow (sourceLoginName = null, targetLoginName = null, sourceId = null, targetId = null) {
    return await this.get('/friendships/show', this.purgeParam({
      source_login_name: sourceLoginName,
      target_login_name: targetLoginName,
      source_id: sourceId,
      target_id: targetId
    }))
  }

  /****************************************
   * FRIENDS
   ****************************************/

  /**
   * 返回用户好友的 id 列表
   *
   * @param {string} [id=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async friendsIds (id = null, count = 20, page = 1) {
    return await this.get('/friends/ids', this.purgeParam({id, count, page}))
  }

  /****************************************
   * STATUSES
   ****************************************/

  /**
   * 删除指定的消息
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async statusesDestroy (id = null) {
    return await this.post('/statuses/destroy', this.purgeParam({id}))
  }

  /**
   * 显示指定用户及其好友的消息（未设置隐私用户和登录用户好友的消息）
   *
   * @param {string} [id=null]
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async statusesHomeTimeline (id = null, sinceId = null, maxId = null, count = 20, page = 1) {
    return await this.get('/statuses/home_timeline', this.purgeParam({id, since_id: sinceId, max_id: maxId, count, page}))
  }

  /**
   * 显示 20 条随便看看的消息（未设置隐私用户的消息）
   *
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async statusesPublicTimeline (sinceId = null, maxId = null, count = 20, page = 1) {
    return await this.get('/statuses/public_timeline', this.purgeParam({since_id: sinceId, max_id: maxId, count, page}))
  }

  /**
   * 显示回复当前用户的 20 条消息（未设置隐私用户和登录用户好友的消息）
   *
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async statusesReplies (sinceId = null, maxId = null, count = 20, page = 1) {
    return await this.get('/statuses/replies', this.purgeParam({since_id: sinceId, max_id: maxId, count, page}))
  }

  /**
   * 返回用户的前 100 个关注者
   *
   * @param {string} [id=null]
   * @param {number} [count=100]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async statusesFollowers (id = null, count = 100, page = 1) {
    return await this.get('/statuses/followers', this.purgeParam({id, count, page}))
  }

  /**
   * 发送消息
   *
   * @param {string} [status=null]
   * @param {string} [inReplyToStatusId=null]
   * @param {string} [inReplyToUserId=null]
   * @param {string} [repostStatusId=null]
   * @param {string} [location=null]
   * @returns
   * @memberof API
   */
  async statusesUpdate (status = null, inReplyToStatusId = null, inReplyToUserId = null, repostStatusId = null, location = null) {
    return await this.post('/statuses/update', this.purgeParam({
      status,
      in_reply_to_status_id: inReplyToStatusId,
      in_reply_to_user_id: inReplyToUserId,
      repost_status_id: repostStatusId,
      location
    }))
  }

  /**
   * 浏览指定用户已发送消息
   *
   * @param {string} [id=null]
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async statusesUserTimeline (id = null, sinceId = null, maxId = null, count = 20, page = 1) {
    return await this.get('/statuses/user_timeline', this.purgeParam({id, since_id: sinceId, max_id: maxId, count, page}))
  }

  /**
   * 返回用户好友
   *
   * @param {string} [id=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async statusesFriends (id = null, count = 20, page = 1) {
    return await this.get('/statuses/friends', this.purgeParam({id, count, page}))
  }

  /**
   * 按照时间先后顺序显示消息上下文（好友和未设置隐私用户的消息）
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async statusesContextTimeline (id = null) {
    return await this.get('/statuses/context_timeline', this.purgeParam({id}))
  }

  /**
   * 显示回复/提到当前用户的 20 条消息（未设置隐私用户和登录用户好友的消息）
   *
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async statusesMentions (sinceId = null, maxId = null, count = 20, page = 1) {
    return await this.get('/statuses/mentions', this.purgeParam({since_id: sinceId, max_id: maxId, count, page}))
  }

  /**
   * 返回好友或未设置隐私用户的某条消息
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async statusesShow (id = null) {
    return await this.get('/statuses/show', this.purgeParam({id}))
  }

  /****************************************
   * DIRECT MESSAGES
   ****************************************/

  /**
   * 删除某条私信
   *
   * @param {string} [id=null]
   * @returns
   * @memberof API
   */
  async directMessagesDestroy (id = null) {
    return await this.post('/direct_messages/destroy', this.purgeParam({id}))
  }

  /**
   * 以对话的形式返回当前用户与某用户的私信
   *
   * @param {string} [id=null]
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async directMessagesConversation (id = null, sinceId = null, maxId = null, count = 20, page = 1) {
    return await this.get('/direct_messages/conversation', this.purgeParam({id, since_id: sinceId, max_id: maxId, count, page}))
  }

  /**
   * 发送私信
   *
   * @param {string} [user=null]
   * @param {string} [text=null]
   * @param {string} [inReplyToId=null]
   * @returns
   * @memberof API
   */
  async directMessagesNew (user = null, text = null, inReplyToId = null) {
    return await this.post('/direct_messages/new', this.purgeParam({user, text, in_reply_to_id: inReplyToId}))
  }

  /**
   * 以对话的形式返回当前用户的私信列表
   *
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async directMessagesConversationList (count = 20, page = 1) {
    return await this.get('/privete_messages/conversation_list', this.purgeParam({count, page}))
  }

  /**
   * 显示 20 条收件箱中的私信
   *
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async directMessagesInbox (sinceId = null, maxId = null, count = 20, page = 1) {
    return await this.get('/direct_messages/inbox', this.purgeParam({since_id: sinceId, max_id: maxId, count, page}))
  }

  /**
   * 显示发件箱中的私信
   *
   * @param {string} [sinceId=null]
   * @param {string} [maxId=null]
   * @param {number} [count=20]
   * @param {number} [page=1]
   * @returns
   * @memberof API
   */
  async directMessagesSent (sinceId = null, maxId = null, count = 20, page = 1) {
    return await this.get('/direct_messages/sent', this.purgeParam({since_id: sinceId, max_id: maxId, count, page}))
  }
}

module.exports = API
