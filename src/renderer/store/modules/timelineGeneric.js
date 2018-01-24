import _ from 'lodash'

const state = {
  timeline: {},
  sinceId: '',
  maxId: ''
}

const getters = {
  timeline: state => state.timeline,
  sinceId: state => state.sinceId,
  maxId: state => state.maxId
}

const mutations = {
  appendToTimeline (state, value) {
    const key = value.key
    const data = value.data
    const isLoadMore = value.isLoadMore
    if (typeof data !== 'object' || data.length === 0) return false
    const arr = _.values(data).filter(item => typeof item === 'object')
    if (!state.timeline[key]) state.timeline[key] = []
    if (isLoadMore) {
      state.timeline[key] = [...state.timeline[key], ...arr]
    } else {
      state.timeline[key] = [...arr, ...state.timeline[key]]
    }
    state.sinceId = state.timeline[key][0].id
    state.maxId = state.timeline[key][state.timeline[key].length - 1].id
  },
  alterFav (state, value) {
    const key = value.key
    const msgId = value.msgId
    if (!msgId) return false
    const item = _.find(state.timeline[key], {id: msgId})
    item.favorited = !item.favorited
  },
  deleteItem (state, value) {
    const key = value.key
    const msgId = value.msgId
    if (!msgId) return false
    const index = _.findIndex(state.timeline[key], {id: msgId})
    if (index) state.timeline[key].splice(index, 1)
  },
  deleteTimeline (state, value) {
    const key = value.key
    delete state.timeline[key]
  },
  reset (state, value) {
    state.timeline = {}
    state.sinceId = ''
    state.maxId = ''
  }
}

const actions = {
  appendToTimeline (ctx, value) {
    ctx.commit('appendToTimeline', value)
  },
  reset (ctx, value) {
    ctx.commit('reset', value)
  },
  alterFav (ctx, value) {
    ctx.commit('alterFav', value)
  },
  deleteItem (ctx, value) {
    ctx.commit('deleteItem', value)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
