import Toast from './toast.vue'

export default {
  install (Vue, options = {}) {
    const CONSTRUCTOR = Vue.extend(Toast)
    const CACHE = {}
    const mergedOptions = Object.assign(Toast.OPTIONS_TEMPLATE, options)
    Vue.toast = Vue.prototype.$toast = (...args) => {
      if (typeof args[0] === 'string' && typeof args[1] === 'string') {
        const mode = args[0]
        const title = args[1]
        let message = ''
        if (typeof args[2] === 'string') message = args[2]
        args = { mode, title, message }
      } else if (args.length === 1 && typeof args[0] === 'string') {
        const title = args[0]
        args = { title }
      }
      const toast = CACHE[mergedOptions.id] || (CACHE[mergedOptions.id] = new CONSTRUCTOR())
      if (!toast.$el) {
        const vm = toast.$mount()
        document.querySelector(args.parent || 'body').appendChild(vm.$el)
      }
      return toast.enqueue(args)
    }
  }
}
