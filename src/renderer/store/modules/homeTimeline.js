import _ from 'lodash'

const state = {
  timeline: [],
  since_id: '',
  max_id: '',
  unreadIds: []
}

const getters = {
  homeTimeline: state => state.timeline,
  since_id: state => state.since_id,
  max_id: state => state.max_id,
  unreadIds: state => state.unreadIds
}

const mutations = {
  appendToHomeTimeline (state, value) {
    let res = value.res
    let isAppend = value.isAppend
    let isLoadMore = value.isLoadMore
    if (typeof res !== 'object' || res.length === 0) return
    let arr = _.values(res).filter(item => { return typeof item === 'object' })
    if (isAppend) state.unreadIds = _.concat(state.unreadIds, _.map(arr, 'id'))
    if (isLoadMore) {
      state.timeline = [...state.timeline, ...arr]
    } else {
      state.timeline = [...arr, ...state.timeline]
    }
    state.since_id = state.timeline[0].id
    state.max_id = state.timeline[state.timeline.length - 1].id
  },
  markRead (state, value) {
    // accepts a status id as "value"
    state.unreadIds = _.filter(state.unreadIds, o => { return o !== value })
  },
  resetHomeTimeline (state, value) {
    state.timeline = []
    state.since_id = ''
    state.max_id = ''
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
