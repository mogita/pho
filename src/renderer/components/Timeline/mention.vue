<template>
  <div class="timeline-container" id="mention-timeline-container" v-on:scroll="onScroll($el)" ref="mentionTimelineContainer">
    <div id="timeline">
      <template v-for="(item, index) in timelineMention" v-if="item.hasOwnProperty('user')">
        <Card :item="item" :id="item.id" :key="'mention-' + item.id" :belongsTo="'mention'"></Card>
      </template>
      <div class="loading-more-bar" ref="loadingMoreBar">
        •••
      </div>
    </div>
  </div>
</template>

<script>
import Card from './Card'
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

let elTimeline

export default {
  components: {
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
      'timelineMention'
    ])
  },
  watch: {
    timelineMention () {
      this.limitScrolltop()
    }
  },
  methods: {
    async onScroll (el) {
      this.scrollbarHack()
      this.limitScrolltop()
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
    limitScrolltop () {
      const el = this.$refs.mentionTimelineContainer
      if (el && el.scrollTop <= 1) el.scrollTop = 1
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
      elTimeline = this.$refs.mentionTimelineContainer
      elTimeline.scrollTop = 0
      await this.$pho.fetchMention()
      this.$pho.pollMention()
    })
  },
  created () {
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
