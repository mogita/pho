const state = {
  showAlert: false,
  alertTitle: '提示',
  alertMessage: '',
  showToast: false,
  toastIcon: 'fa fa-exclamation-circle',
  toastTitle: '请注意',
  toastMessage: ''
}

const getters = {
  showAlert: state => state.showAlert,
  alertTitle: state => state.alertTitle,
  alertMessage: state => state.alertMessage,
  showToast: state => state.showToast,
  toastIcon: state => state.toastIcon,
  toastTitle: state => state.toastTitle,
  toastMessage: state => state.toastMessage
}

const mutations = {
  setShowAlert (state, value) {
    state.showAlert = value
  },

  setAlertTitle (state, value) {
    state.alertTitle = value
  },

  setAlertMessage (state, value) {
    state.alertMessage = value
  },

  setShowToast (state, value) {
    state.showToast = value
  },

  setToastIcon (state, value) {
    state.toastIcon = value
  },

  setToastTitle (state, value) {
    state.toastTitle = value
  },

  setToastMessage (state, value) {
    state.toastMessage = value
  }
}

const actions = {
  setShowAlert (ctx, value) {
    ctx.commit('setShowAlert', value)
  },

  setAlertTitle (ctx, value) {
    ctx.commit('setAlertTitle', value)
  },

  setAlertMessage (ctx, value) {
    ctx.commit('setAlertMessage', value)
  },

  setShowToast (ctx, value) {
    ctx.commit('setShowToast', value)
  },

  setToastIcon (ctx, value) {
    ctx.commit('setToastIcon', value)
  },

  setToastTitle (ctx, value) {
    ctx.commit('setToastTitle', value)
  },

  setToastMessage (ctx, value) {
    ctx.commit('setToastMessage', value)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
