<template>
  <div class="timeline-container" id="home-timeline-container" @scroll="onScroll" ref="homeTimelineContainer" v-update>
    <Card v-for="item in homeTimeline" v-if="item.hasOwnProperty('user')" :item="item" :id="item.id" :key="'home-' + item.id" :belongsTo="'home'"></Card>
    <div class="loading-more-bar" ref="loadingMoreBar">
      •••
    </div>
  </div>
</template>

<script>
import Card from './Card'
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

let scrollTopHomeId

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
      'sinceId',
      'homeTimeline'
    ])
  },
  watch: {
    sinceId (value, oldValue) {
      scrollTopHomeId = oldValue
    }
  },
  directives: {
    update (tl, binding, vnode) {
      if (tl.scrollTop === 0 && scrollTopHomeId) tl.scrollTop = 1
    }
  },
  methods: {
    async onScroll (event) {
      const el = event.target
      this.scrollbarHack()
      this.$bus.$emit('timeline.scrolled.home')
      // scroll to bottom to load more
      if (this.$refs.loadingMoreBar.getBoundingClientRect().bottom <= el.clientHeight + 90) {
        if (!this.isLoadingMore) {
          this.isLoadingMore = true
          await this.$pho.fetchHome({more: true})
          this.isLoadingMore = false
        }
      }
    },
    offsetScrollTop () {
      const el = this.$refs.homeTimelineContainer
      if (el && el.scrollTop === 0) el.scrollTop = 1
    },
    restoreScrollTop () {
      const el = this.$refs.homeTimelineContainer
      el.scrollTop -= 1
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
    this.$bus.$off('timeline.home.fetch')
    this.$bus.$on('timeline.home.fetch', async () => {
      await this.$pho.fetchHome()
      this.$pho.pollHome()
    })

    this.$nextTick(async () => {
      await this.$pho.fetchHome()
      this.$pho.pollHome()
    })

    window.addEventListener('keyup', (e) => {
      if (e.key === 'r' && !this.showCraftStatus) {
        this.fetch()
      }
    })
  },
  created () {
    this.$bus.$off('tab.switch')
    this.$bus.$on('tab.switch', tab => {
      if (tab !== 'home') this.offsetScrollTop()
      else {
        this.$nextTick(() => {
          this.restoreScrollTop()
        })
      }
    })

    this.$bus.$off('timeline.home.view.beforePush')
    this.$bus.$on('timeline.home.view.beforePush', () => {
      this.offsetScrollTop()
    })

    ipcRenderer.on('timeline.home.fetch', async (event, args) => {
      await this.$pho.fetchHome(args)
    })
  }
}
</script>

<style lang="scss" scoped>
.timeline-container {
  height: calc(100vh - 110px);
  overflow-y: scroll;
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
