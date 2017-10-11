<template>
  <div>
    <transition :name="options.transition">
      <div class="container" v-if="visible">
        <div class="toast" :class="options.mode">
          <div class="toast-icon"><i :class="options.icon"></i></div>
          <div class="toast-body">
            <div class="toast-title">{{ options.title }}</div>
            <div class="toast-message">{{ options.message }}</div>
          </div>
          <div class="toast-control" @click="dismiss"><i class="fa fa-times"></i></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
const OPTIONS_TEMPLATE = {
  id: 'vue-zydialog-toast', // DOM id
  className: '', // additional class name
  override: true, // current toast overrides the queue and cancel any toasts before it
  transition: 'slidedown', // transition name
  icon: 'fa fa-info fa-fw', // toast icon
  duration: 2000, // milliseconds before auto close, set to 0 or any falsy value to disable auto close
  title: '', // toast title
  message: '', // toast message
  mode: 'info', // info, warn, danger, success
  action: null // callback function when toast is dismissed
}

class Later {
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}

export default {
  OPTIONS_TEMPLATE,
  props: [],
  components: {},
  computed: {
    options () {
      return Object.assign({}, OPTIONS_TEMPLATE, this.optionsData)
    }
  },
  watch: {},
  data () {
    return {
      queue: [],
      optionsData: {},
      visible: false,
      timeoutHandler: null,
      promiseHandler: null
    }
  },
  methods: {
    enqueue (args) {
      const pending = this.queue.length
      if (args.override) {
        this.queue = [args]
        this.transit()
      } else {
        this.queue.push(args)
        if (pending === 0) this.transit()
      }
      args.promiseHandler = new Later()
      return args.promiseHandler.promise
    },
    consume () {
      this.optionsData.promiseHandler.resolve()
      if (this.timeoutHandler) clearTimeout(this.timeoutHandler)
      this.timeoutHandler = null
      this.transit()
      this.queue.shift()
    },
    transit () {
      this.visible = false
      setTimeout(() => {
        if (this.queue.length) {
          this.optionsData = this.queue[0]
          this.visible = true
          if (this.options.duration) {
            this.timeoutHandler = setTimeout(() => {
              this.consume()
            }, this.options.duration)
          }
        }
      })
    },
    dismiss () {
      this.consume()
      if (typeof this.options.action === 'function') {
        this.options.action()
      }
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 0;
  left: calc((100vw - 480px) / 2);
  width: 480px;
  z-index: 10000;
  user-select: none;
  cursor: default;
}

.toast {
  display: flex;
  align-items: center;
  color: #ffffff;
  padding: 12px 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  &.info {
    background: #03a9f4;
  }

  &.warn {
    background: #ff9800;
  }

  &.danger {
    background: #f44336;
  }

  &.success {
    background: #4caf50;
  }

  .toast-icon {
    flex: 0 0 60px;
    display: flex;
    align-items: center;
    align-self: flex-start;
    
    i {
      font-size: 18px;
      margin: 0 auto;
      padding-top: 3px;
    }
  }

  .toast-body {
    flex: 1;
    word-break: break-all;
    display: flex;
    flex-direction: column;

    .toast-title {
      font-size: 14px;
      font-weight: 600;
    }

    .toast-message {
      font-size: 12px;
    }
  }

  .toast-control {
    flex: 0 0 50px;
    display: flex;
    align-items: center;
    align-self: flex-start;

    i {
      font-size: 14px;
      margin: 0 auto;
      padding-top: 4px;
    }

    i:hover {
      cursor: pointer;
      text-shadow: 0 0 2px 2px #f0f0f0;
    }

    i:active {
      color: #fafafa;
      text-shadow: 0 0 10px #f0f0f0;
    }
  }
}

.slidedown-enter-active {
  transition: all .2s ease;
}
.slidedown-leave-active {
  transition: all .3s ease;
}
.slidedown-enter, .slidedown-leave-to {
  transform: translateY(-40px);
  opacity: 0;
}
</style>
