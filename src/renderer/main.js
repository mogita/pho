import Vue from 'vue'
import axios from 'axios'
import VueKeepScrollPosition from 'vue-keep-scroll-position'

import App from './App'
import router from './router'
import store from './store'
import Pho from './class/pho'
import Toast from './components/Toast'

import 'font-awesome/css/font-awesome'
import './styles/global.scss'
import './styles/utility'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Toast)
Vue.use(VueKeepScrollPosition)

// hook toast to an global event
window.addEventListener('toast', event => {
  const type = event.detail.type || null
  const title = event.detail.title || null
  const message = event.detail.message || null
  if (type && title) {
    Vue.prototype.$toast(type, title, message)
  }
})

// instanciate an event bus
Vue.prototype.$bus = new Vue()

// instanciate Pho controller
const pho = new Pho()
Vue.prototype.$pho = pho

// Attempt to auto login
pho.attemptAutoLogin()

/* eslint-disable no-new */
new Vue({
  router,
  store,
  template: '<App/>',
  components: { App }
}).$mount('#app')
