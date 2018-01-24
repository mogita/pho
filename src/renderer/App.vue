<template>
  <div class="app" id="app">
    <div class="wrapper">
      <div class="window-title">
        <WindowTitle></WindowTitle>
      </div>
      <div class="tab-bar" v-if="$route.meta.family === 'app' && loginState === true">
        <Tabbar></Tabbar>
      </div>

      <mainframe v-if="$route.meta.family === 'app'"/>
      <router-view v-else-if="$route.meta.family === 'util'"></router-view>

    </div>
  </div>
</template>

<script>
import { webFrame } from 'electron'
import { mapGetters } from 'vuex'

import WindowTitle from './components/WindowTitle/index'
import Tabbar from './components/Tabbar/index'
import mainframe from './components/mainframe'

export default {
  components: {
    WindowTitle,
    Tabbar,
    mainframe
  },
  computed: {
    ...mapGetters('user', [
      'loginState'
    ])
  },
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
  position: relative;
  overflow: hidden;
}

.window-title {
  flex: 0 0 40px;
  z-index: 999999;
}

.tab-bar {
  flex: 0 0 40px;
  z-index: 999999;
}
</style>
