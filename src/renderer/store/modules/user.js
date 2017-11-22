import { toast } from '../../bus/uiBus'

const state = {
  loginState: JSON.parse(window.localStorage.getItem('loginState')) || false,
  authData: JSON.parse(window.localStorage.getItem('authData')) || {},
  userData: {}
}

const getters = {
  loginState: state => state.loginState,
  authData: state => state.authData,
  userData: state => state.userData
}

const mutations = {
  setAuthData (state, value) {
    state.authData = value
  },

  setLoginState (state, value) {
    state.loginState = value
  },

  setUserhData (state, value) {
    state.userData = value
  }
}

const actions = {
  // signin
  setAuthData ({commit}, res) {
    window.localStorage.setItem('authData', JSON.stringify(res))
    window.localStorage.setItem('loginState', true)
    commit('setAuthData', res)
    commit('setLoginState', true)
  },

  // signout
  unsetAuthData ({commit}, res) {
    window.localStorage.removeItem('authData')
    window.localStorage.removeItem('loginState')
    commit('setAuthData', {})
    commit('setUserhData', {})
    commit('setLoginState', false)
    this.dispatch('timelineHome/reset')
  },

  fetchUserData ({commit}, res) {
    let api = require('../../api/index')
    api.auth()
      .then(res => {
        commit('setUserhData', res)
      })
      .catch(err => {
        toast(err, '登录错误')
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
