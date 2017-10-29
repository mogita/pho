<template>
  <div class="timeline-container" id="mention-timeline-container" @scroll="onScroll" ref="mentionTimelineContainer" v-update>
    <Card v-for="(item, index) in timelineMention" v-if="item.hasOwnProperty('user')" :item="item" :id="item.id" :key="'mention-' + item.id" :belongsTo="'mention'"></Card>
    <div class="loading-more-bar" ref="loadingMoreBar">
      •••
    </div>
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import Card from './Card'
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

let scrollTopMentionId

export default {
  components: {
    VirtualList,
    Card
  },
  name: 'timelineMention',
  data () {
    return {
      delta: 5,
      isloadingMore: false,
      scrollbarTimeoutHandle: null
    }
  },
  computed: {
    ...mapGetters('timelineMention', [
      'sinceId',
      'timelineMention'
    ])
  },
  watch: {
    sinceId (value, oldValue) {
      scrollTopMentionId = oldValue
    }
  },
  directives: {
    update (tl, binding, vnode) {
      if (tl.scrollTop === 0 && vnode.children.length > 2 && scrollTopMentionId) {
        setTimeout(() => {
          const rect = document.getElementById('mention-' + scrollTopMentionId).getBoundingClientRect()
          tl.scrollTop = rect.top - 81
        })
      }
    }
  },
  methods: {
    async onScroll (el) {
      this.scrollbarHack()
      this.$bus.$emit('timeline.scrolled.mention')
      // scroll to bottom to load more
      if (this.$refs.loadingMoreBar.getBoundingClientRect().bottom <= el.clientHeight + 90) {
        if (!this.isLoadingMore) {
          this.isLoadingMore = true
          await this.$pho.fetchMention({more: true})
          this.isLoadingMore = false
        }
      }
    },
    offsetScrollTop () {
      const el = this.$refs.mentionTimelineContainer
      if (el && el.scrollTop === 0) el.scrollTop = 1
    },
    restoreScrollTop () {
      const el = this.$refs.mentionTimelineContainer
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
    this.$bus.$off('timeline.mention.fetch')
    this.$bus.$on('timeline.mention.fetch', async () => {
      await this.$pho.fetchMention()
      this.$pho.pollMention()
    })

    this.$nextTick(async () => {
      await this.$pho.fetchMention()
      this.$pho.pollMention()
    })
  },
  created () {
    this.$bus.$off('tab.switch')
    this.$bus.$on('tab.switch', tab => {
      if (tab !== 'mention') this.offsetScrollTop()
      else {
        this.$nextTick(() => {
          this.restoreScrollTop()
        })
      }
    })
    ipcRenderer.on('timeline.mention.fetch', async (event, args) => {
      await this.$pho.fetchMention(args)
    })
  }
}
</script>

<style lang="scss" scoped>
.timeline-container {
  height: calc(100vh - 80px);
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
