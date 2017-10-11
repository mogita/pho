import _ from 'lodash'

const state = {
  timeline: [],
  sinceId: '',
  maxId: '',
  unreadIds: []
}

const getters = {
  homeTimeline: state => state.timeline,
  sinceId: state => state.sinceId,
  maxId: state => state.maxId,
  unreadIds: state => state.unreadIds
}

const mutations = {
  appendToHomeTimeline (state, value) {
    const data = value.data
    const isAppend = value.isAppend
    const isLoadMore = value.isLoadMore
    if (typeof data !== 'object' || data.length === 0) return false
    const arr = _.values(data).filter(item => { return typeof item === 'object' })
    if (isAppend) state.unreadIds = _.concat(state.unreadIds, _.map(arr, 'id'))
    if (isLoadMore) {
      state.timeline = [...state.timeline, ...arr]
    } else {
      state.timeline = [...arr, ...state.timeline]
    }
    state.sinceId = state.timeline[0].id
    state.maxId = state.timeline[state.timeline.length - 1].id
  },
  markRead (state, value) {
    // accepts a status id as "value"
    state.unreadIds = _.filter(state.unreadIds, o => { return o !== value })
  },
  alterFav (state, msgId) {
    if (!msgId) return false
    const item = _.find(state.timeline, {id: msgId})
    item.favorited = !item.favorited
  },
  resetHomeTimeline (state, value) {
    state.timeline = []
    state.sinceId = ''
    state.maxId = ''
  }
}

const actions = {
  appendToHomeTimeline (ctx, value) {
    ctx.commit('appendToHomeTimeline', value)
  },
  resetHomeTimeline (ctx, value) {
    ctx.commit('resetHomeTimeline', value)
  },
  markRead (ctx, value) {
    ctx.commit('markRead', value)
  },
  alterFav (ctx, value) {
    ctx.commit('alterFav', value)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
