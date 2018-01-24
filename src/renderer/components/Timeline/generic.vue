<template>
  <div class="timeline-container" id="generic-timeline-container" @scroll="onScroll" ref="genericTimelineContainer">
    <Card v-for="item in timeline" v-if="item.hasOwnProperty('user')" :item="item" :id="item.id" :key="'generic-' + nonce + '-' + item.id" :belongsTo="belongsTo"></Card>
    <div class="loading-more-bar" ref="loadingMoreBar">
      •••
    </div>
  </div>
</template>

<script>
import Card from './Card'

export default {
  props: ['args', 'nonce', 'belongsTo'],
  components: {
    Card
  },
  computed: {},
  watch: {},
  data () {
    return {
      timeline: [],
      isloadingMore: false
    }
  },
  methods: {
    async onScroll (event) {
      this.scrollbarHack()
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
    this.$nextTick(async () => {
      if (this.args.type === 'tag') {
        this.timeline = await this.$pho.fetchSearch({
          keyword: this.args.keyword,
          key: this.nonce
        })
      } else if (this.args.type === 'user_statuses_list') {
        this.timeline = await this.$pho.fetchUserStatuses({
          id: this.args.id,
          key: this.nonce
        })
      }
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
