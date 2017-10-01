import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import eventBus from './bus/eventBus'

import 'font-awesome/css/font-awesome'
import './styles/global.scss'
import './styles/utility'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(eventBus)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  template: '<App/>',
  components: { App }
}).$mount('#app')
