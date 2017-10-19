import Vue from 'vue'
import Router from 'vue-router'
import App from './../App'

Vue.use(Router)

export default new Router({
  scrollBehavior: function (to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'appRoot',
      component: App,
      meta: {family: 'app'}
    },
    {
      path: '/preview',
      name: 'previewModule',
      component: require('./../components/Preview/index').default,
      meta: {
        family: 'util'
      }
    },
    {
      path: '/composer',
      name: 'statusComposerModule',
      component: require('./../components/Composer/index').default,
      meta: {
        family: 'util'
      }
    }
  ]
})
