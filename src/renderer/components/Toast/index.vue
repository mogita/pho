<template>
  <transition name="slidedown">
    <div class="container" v-show="showToast">
      <div class="toast">
        <div class="toast-icon"><i :class="toastIcon"></i></div>
        <div class="toast-body">
          <div class="toast-title">{{ toastTitle }}</div>
          <div class="toast-message">{{ toastMessage }}</div>
        </div>
        <div class="toast-control"><i class="fa fa-times" @click="dismiss"></i></div>
      </div>
    </div>
  </transition>
</template>

<script>
import store from '../../store'
import { mapGetters } from 'vuex'

export default {
  store,

  computed: {
    ...mapGetters([
      'showToast',
      'toastIcon',
      'toastTitle',
      'toastMessage'
    ])
  },

  methods: {
    dismiss () {
      store.dispatch('setShowToast', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 40px;
  left: calc((100vw - 480px) / 2);
  width: 480px;
  z-index: 10000;
  user-select: none;
  cursor: default;
}

.toast {
  display: flex;
  background: linear-gradient(to top, #d31027, #ea384d);
  color: #ffffff;
  padding: 12px 0 18px 0;
  border-bottom: 1px solid #b5071b;
  border-left: 1px solid #b5071b;
  border-right: 1px solid #b5071b;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;

  .toast-icon {
    flex: 0 0 80px;
    display: flex;
    align-items: center;
    
    i {
      font-size: 28px;
      margin: 0 auto;
    }
  }

  .toast-body {
    width: 350px;
    word-break: break-all;

    .toast-title {
      font-size: 14px;
      font-weight: 600;
    }

    .toast-message {
      font-size: 14px;
    }
  }

  .toast-control {
    flex: 0 0 50px;
    display: flex;
    align-items: center;

    i {
      font-size: 14px;
      margin: 0 auto;
      padding: 5px;
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

.slidedown-enter-active, .slidedown-leave-active {
  transition: top .2s ease-out, opacity .2s cubic-bezier(.68,.63,.93,.74);
}
.slidedown-enter {
  transition: top .2s ease-out, opacity .2s cubic-bezier(.41,.96,.41,.97);
  opacity: 0;
  top: -10px;
}

.slidedown-leave-to {
  transition: top .2s ease-out, opacity .2s cubic-bezier(.41,.96,.41,.97);
  opacity: 0;
}
</style>
