const state = {
  showLoading: false
}

const getters = {
  showLoading: state => state.showLoading
}

const mutations = {
  setShowLoading (state, value) {
    state.showLoading = value
  }
}

const actions = {
  setShowLoading (ctx, value) {
    ctx.commit('setShowLoading', value)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
