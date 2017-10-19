<template>
  <div class="content-wrapper" id="content-wrapper">
    <div class="login" v-if="loginState !== true">
      <LoginView></LoginView>
    </div>

    <div class="main" v-if="loginState === true">
      <timelineHome v-show="activeTab === 'home'"></timelineHome>
      <timelineMention v-show="activeTab === 'mention'"></timelineMention>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import LoginView from './../components/Login/index'
import timelineHome from './../components/Timeline/home'
import timelineMention from './../components/Timeline/mention'

export default {
  components: {
    LoginView,
    timelineHome,
    timelineMention
  },

  computed: {
    ...mapGetters('user', [
      'loginState'
    ]),
    ...mapGetters('tab', [
      'activeTab'
    ])
  },
  mounted () {}
}
</script>

<style scoped>
.content-wrapper {
  position: relative;
}

.main {
  overflow: hidden;
}

.login {
  overflow: hidden;
  z-index: 9999;
}
</style>
