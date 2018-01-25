<template>
  <div class="content-wrapper" id="content-wrapper">
    <div class="login" v-if="loginState !== true">
      <LoginView></LoginView>
    </div>

    <div class="main" v-if="loginState === true">
      <timelineHomeContainer :class="{hidden: activeTab !== 'home'}"></timelineHomeContainer>
      <timelineMentionContainer :class="{hidden: activeTab !== 'mention'}"></timelineMentionContainer>
      <meContainer :class="{hidden: activeTab !== 'me'}"></meContainer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginView from './../components/Login/index'
import timelineHomeContainer from './Container/home'
import timelineMentionContainer from './Container/mention'
import meContainer from './Container/me'

export default {
  components: {
    LoginView,
    timelineHomeContainer,
    timelineMentionContainer,
    meContainer
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

.hidden {
  position: fixed;
  top: -9999px;
  left: -9999px;
}

.login {
  overflow: hidden;
  z-index: 9999;
}
</style>
