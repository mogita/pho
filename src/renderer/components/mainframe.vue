<template>
  <div class="app">
    
    <div class="wrapper">
      <div class="window-title">
        <WindowTitle></WindowTitle>
      </div>
      <div class="tab-bar" v-if="$route.meta.family === 'app'">
        <Tabbar></Tabbar>
      </div>

      <div class="login" v-if="loginState !== true">
        <LoginView></LoginView>
      </div>

      <div class="main" v-if="loginState === true">
        <router-view></router-view>
      </div>

    </div>
  </div>
</template>

<script>
import { webFrame } from 'electron'
import { mapGetters } from 'vuex'
import WindowTitle from './../components/WindowTitle/index'
import Tabbar from './../components/Tabbar/index'
import LoginView from './../components/Login/index'

export default {
  components: {
    WindowTitle,
    Tabbar,
    LoginView
  },

  computed: {
    ...mapGetters('user', [
      'loginState'
    ])
  },
  mounted () {},
  created () {
    webFrame.setVisualZoomLevelLimits(1, 1)
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-flow: column;
  height: 100vh;
}

.window-title {
  flex: 0 0 40px;
  z-index: 999999;
}

.tab-bar {
  flex: 0 0 40px;
  z-index: 99;
}

.main {
  overflow: hidden;
}

.login {
  overflow: hidden;
  z-index: 9999;
}

.craft-status {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
