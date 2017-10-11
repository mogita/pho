<template>
  <div class="timeline-container" id="timelineContainer" v-on:scroll="onScroll($el)" ref="timelineContainer">
    <div id="timeline">
      <template v-for="(item, index) in homeTimeline" v-if="item.hasOwnProperty('user')">
        <Card :item="item" :id="item.id" :key="item.id"></Card>
      </template>
      <div class="loading-more-bar" ref="loadingMoreBar">
        •••
      </div>
    </div>
  </div>
</template>

<script>
import Card from './pieces/Card'
import { mapGetters } from 'vuex'

let elTimeline

export default {
  components: {
    Card
  },
  name: 'timeline',
  data () {
    return {
      poller: null,
      delta: 5,
      isloadingMore: false,
      scrollbarTimeoutHandle: null
    }
  },
  computed: {
    ...mapGetters('timelineHome', [
      'showCraftStatus',
      'homeTimeline',
      'loginState'
    ])
  },
  methods: {
    initFetch () {
      if (this.loginState) {
        this.$api.getHomeTimeline(false, () => {
          let el = this.$refs.timelineContainer
          if (el.scrollTop === 0) el.scrollTop = 1
        })
      }
    },
    fetch () {
      if (this.loginState) {
        let el = this.$refs.timelineContainer
        if (el.scrollTop === 0) el.scrollTop = 1
        this.$api.getHomeTimeline(true)
      }
    },
    async onScroll (el) {
      this.scrollbarHack()
      this.$bus.$emit('scrollHomeTimeline')
      // scroll to bottom to load more
      if (this.$refs.loadingMoreBar.getBoundingClientRect().bottom <= el.clientHeight + 90) {
        if (!this.isLoadingMore) {
          this.isLoadingMore = true
          await this.$pho.fetchHome({more: true})
          this.isLoadingMore = false
        }
      }
    },
    scrollbarHack () {
      const scrollbarStyle = document.getElementById('scroll-bar-styles')
      scrollbarStyle.innerHTML = `
        /* The scrollbar hack */
        ::-webkit-scrollbar {
          width: 6px;
        }
      `
      if (this.scrollbarTimeoutHandle) clearTimeout(this.scrollbarTimeoutHandle)
      this.scrollbarTimeoutHandle = setTimeout(() => {
        scrollbarStyle.innerHTML = `
          /* The scrollbar hack */
          ::-webkit-scrollbar {
            width: 0;
          }
        `
      }, 2000)
    }
  },
  mounted () {
    this.$bus.$off('timeline.fetch.home')
    this.$bus.$on('timeline.fetch.home', async () => {
      await this.$pho.fetchHome()
    })

    this.$nextTick(async () => {
      elTimeline = this.$refs.timelineContainer
      elTimeline.scrollTop = 0
      await this.$pho.fetchHome()
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'r' && !this.showCraftStatus) {
        this.fetch()
      }
    })
  },
  created () {}
}
</script>

<style lang="scss" scoped>
.timeline-container {
  height: calc(100vh - 80px);
  overflow-y: scroll;
  transition: all 0.5s;
  overflow: overlay;
}

.loading-more-bar {
  font-size: 12px;
  line-height: 30px;
  text-align: center;
  background: #f0f0f0;
  color: #777777;
}
</style>
