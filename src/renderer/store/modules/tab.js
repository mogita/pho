const state = {
  activeTab: 'home'
}

const getters = {
  activeTab: state => state.activeTab
}

const mutations = {
  setActiveTab (state, value) {
    state.activeTab = value
  }
}

const actions = {
  setActiveTab (ctx, value) {
    ctx.commit('setActiveTab', value)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
