<template>
  <div class="container">
    <div class="placer">
      <i class="fa fa-twitter"></i>
    </div>
    <transition name="fade">
      <div class="loading" v-show="showLoading">
        <Loading></Loading>
      </div>
    </transition>
    <button @click="logout">Logout</button>
    <div class="new-status-button" v-if="$route.meta.family === 'app' && loginState">
      <NewStatusButton></NewStatusButton>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NewStatusButton from './pieces/NewStatusButton'
import Loading from './../Indicator/Loading'

export default {
  components: {
    NewStatusButton,
    Loading
  },
  computed: {
    ...mapGetters('indicator', [
      'showLoading'
    ]),
    ...mapGetters('user', [
      'loginState'
    ])
  },
  methods: {
    logout () {
      this.$pho.logout()
    }
  }
}
</script>

<style scoped>
.container {
  -webkit-app-region: drag;
  background-color: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.placer {
  color: transparent;
  font-size: 22px;
  height: 40px;
}

.new-status-button {
  -webkit-app-region: no-drag;
}
</style>
