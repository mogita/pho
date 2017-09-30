import Vue from 'vue'
const eventBus = new Vue()
export default {
  eventBus,
  install (Vue, options) {
    Vue.prototype.$eventBus = eventBus
  }
}
