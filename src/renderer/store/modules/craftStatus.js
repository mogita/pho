const state = {
  showCraftStatus: false,
  statusContent: '',
  imageFilePath: '',
  remainingLength: {
    exceeded: false,
    counterText: '还可以写 140 字'
  },
  inReplyToStatusId: '',
  inReplyToUserId: '',
  repostStatusId: '',
  statusLocation: ''
}

const getters = {
  showCraftStatus: state => state.showCraftStatus,
  statusContent: state => state.statusContent,
  imageFilePath: state => state.imageFilePath,
  remainingLength: state => state.remainingLength,
  inReplyToStatusId: state => state.inReplyToStatusId,
  inReplyToUserId: state => state.inReplyToUserId,
  repostStatusId: state => state.repostStatusId,
  statusLocation: state => state.statusLocation
}

const mutations = {
  setShowCraftStatus (state, value) {
    state.showCraftStatus = value
  },
  setStatusContent (state, value) {
    state.statusContent = value

    // update remaining length
    let length = 140 - state.statusContent.length

    if (length >= 0) {
      state.remainingLength.exceeded = false
      state.remainingLength.counterText = `还可以写 ${length} 字`
    } else {
      state.remainingLength.exceeded = true
      state.remainingLength.counterText = `已超出 ${Math.abs(length)} 字，超出部分将被截断`
    }
  },
  setImageFilePath (state, value) {
    state.imageFilePath = value
  },
  setInReplyToStatusId (state, value) {
    state.inReplyToStatusId = value
  },
  setInReplyToUserId (state, value) {
    state.inReplyToUserId = value
  },
  setRepostStatusId (state, value) {
    state.repostStatusId = value
  },
  setStatusLocation (state, value) {
    state.statusLocation = value
  },
  resetAll (state, value) {
    state.statusContent = ''
    state.imageFilePath = ''
    state.inReplyToStatusId = ''
    state.inReplyToUserId = ''
    state.repostStatusId = ''
    state.statusLocation = ''
    state.remainingLength = {
      exceeded: false,
      counterText: '还可以写 140 字'
    }
  }
}

const actions = {
  setShowCraftStatus (ctx, value) {
    ctx.commit('setShowCraftStatus', value)
  },
  setStatusContent (ctx, value) {
    ctx.commit('setStatusContent', value)
  },
  setImageFilePath (ctx, value) {
    ctx.commit('setImageFilePath', value)
  },
  setInReplyToStatusId (ctx, value) {
    ctx.commit('setInReplyToStatusId', value)
  },
  setInReplyToUserId (ctx, value) {
    ctx.commit('setInReplyToUserId', value)
  },
  setRepostStatusId (ctx, value) {
    ctx.commit('setRepostStatusId', value)
  },
  setStatusLocation (ctx, value) {
    ctx.commit('setStatusLocation', value)
  },
  resetAll (ctx, value) {
    ctx.commit('resetAll', value)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
