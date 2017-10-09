<template>
  <div class="container" :class="{hide: count <= 0 || hide}" @click="gotoLastUnread">
    {{ count }}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: [],
  components: {},
  computed: {
    // TODO: unreadCount not reacting to changes in vuex
    ...mapGetters([
      'unreadIds'
    ])
  },
  watch: {
    unreadIds (after) {
      this.$data.count = after.length
      this.$data.hide = false
    }
  },
  data () {
    return {
      count: 0,
      hide: true
    }
  },

  methods: {
    gotoLastUnread () {
      // todo
    }
  },
  mounted () {
    this.$data.count = this.unreadIds.length
  },
  created () {
    this.$bus.$on('hideUnreadBadge', () => { this.$data.hide = true })
    this.$bus.$on('showUnreadBadge', () => { this.$data.hide = false })
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: 40px;
  right: 22px;
  background: rgba(50, 50, 50, 0.7);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 3px 18px;
  color: #ffffff;
  font-size: 11px;
  z-index: 89;
  transition: all .3s;
}

.container.hide {
  top: 0;
}
</style>
