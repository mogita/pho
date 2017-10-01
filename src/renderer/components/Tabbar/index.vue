<template>
  <div class="container">
    <div class="tab-wrapper">
      <div class="tab-pill">
        <div class="tab-label" :class="{active: activeTab === 'home'}" @click="switchTab('home')">
          <i class="fa fa-home fa-fw"></i><span class="counter" v-if="homeTlUnreadCount"> {{homeTlUnreadCount}}</span>
        </div>
      </div>

      <div class="tab-pill">
        <div class="tab-label" :class="{active: activeTab === 'mention'}" @click="switchTab('mention')">
          <i class="fa fa-at fa-fw"></i><span class="counter"> 123</span>
        </div>
      </div>

      <div class="tab-pill">
        <div class="tab-label" :class="{active: activeTab === 'dm'}" @click="switchTab('dm')">
          <i class="fa fa-envelope-o fa-fw"></i><span class="counter"> 1234</span>
        </div>
      </div>

      <div class="tab-pill">
        <div class="tab-label" :class="{active: activeTab === 'search'}" @click="switchTab('search')">
          <i class="fa fa-search fa-fw"></i>
        </div>
      </div>

      <div class="tab-pill">
        <div class="tab-label" :class="{active: activeTab === 'profile'}" @click="switchTab('profile')">
          <i class="fa fa-user-o fa-fw"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: [],
  components: {},
  computed: {
    ...mapGetters([
      'unreadIds'
    ]),
    homeTlUnreadCount () {
      return this.unreadIds.length || 0
    }
  },
  watch: {},
  data () {
    return {
      activeTab: 'home'
    }
  },
  methods: {
    switchTab (tab) {
      this.activeTab = tab
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.container {
  height: 40px;
  width: 100%;
  background-color: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;

  .tab-wrapper {
    // background: pink;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    max-width: 600px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    cursor: default;

    .tab-pill {
      width: 80px;
      height: 100%;
      // background: cyan;
      display: flex;
      justify-content: center;
      align-items: center;

      .tab-label {
        width: 100%;
        text-align: center;
        font-size: 12px;
        padding: 4px 0;
        border-radius: 50px;
        color: #555555;
        
        .counter {
          font-size: 10px;
        }

        &.active {
          color: #ffffff;
          background: #00ccff;
        }
      }
    }
  }
}
</style>
