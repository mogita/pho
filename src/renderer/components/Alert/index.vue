<template>
  <transition name="fade">
    <div class="container" v-show="showAlert">
      <div class="navbar-spacer with-dark-overlay"></div>
      <div class="dark-overlay">
        <div class="box" @click.stop>
          <div class="box-header">
            <div class="box-title">{{ alertTitle }}</div>
          </div>
          <div class="box-body">
            {{ alertMessage }}
          </div>
          <div class="box-footer">
            <div class="blue-button flex-end" @click="dismissAlert">好</div>
          </div>
        </div>
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
      'showAlert',
      'alertTitle',
      'alertMessage'
    ])
  },

  methods: {
    dismissAlert () {
      store.dispatch('setShowAlert', false)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/flexbox';
@import '../../styles/box';
@import '../../styles/button';

.container {
  height: 100vh;
  width: 100vw;
  z-index: 10000;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
}
</style>
