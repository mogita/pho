<template>
  <section>
    <div class="view-nav">
      <div class="nav-btn-wrapper">
        <div class="nav-btn" @click="handleGoBack" :class="{'hide': viewStack.length <= 1}">
          <i class="fa fa-angle-left"></i>&nbsp;&nbsp;{{(viewStack[1]) ? viewStack[1].title : viewStack[0].title}}
        </div>
      </div>
      <div class="nav-title">{{viewStack[0].title}}</div>
    </div>
    <transition :name="'router-' + direction">
      <keep-alive>
        <component :is="viewStack[0].component" :key="viewStack[0].nonce" :nonce="viewStack[0].nonce" :args="viewStack[0].args" :belongsTo="viewStack[0].belongsTo" v-keep-scroll-position></component>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import timelineMention from './../Timeline/mention'
import profile from './../Profile'
import timelineGeneric from './../Timeline/generic'

export default {
  props: [],
  components: {
    timelineMention,
    timelineGeneric,
    profile
  },
  computed: {},
  watch: {},
  data () {
    return {
      viewStack: [{component: 'timelineMention', args: {}, nonce: 0, title: 'Mention', belongsTo: 'mention'}],
      direction: ''
    }
  },
  methods: {
    handleGoBack () {
      if (this.viewStack.length > 1) {
        this.direction = 'backward'
        this.viewStack.shift()
      }
    }
  },
  mounted () {
    this.$bus.$off('timeline.mention.view.push')
    this.$bus.$on('timeline.mention.view.push', args => {
      this.direction = 'forward'
      this.viewStack.unshift(args)
    })
    this.$bus.$off('timeline.mention.view.pop')
    this.$bus.$on('timeline.mention.view.pop', this.handleGoBack)
  }
}
</script>

<style lang="scss" scoped>
@import './../../styles/transition-nav.scss';

.view-nav {
  position: relative;
  background: #f3f3f3;
  user-select: none;
  font-size: 12px;
  cursor: default;

  .nav-btn-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 599;

    .nav-btn {
      position: relative;
      display: inline-block;
      padding: 0 10px;
      transition: all .2s;
      line-height: 2.5em;

      &.hide {
        transition: all .2s;
        opacity: 0;
      }

      &:active {
        color: #8f8f8f;
      }
    }
  }

  .nav-title {
    text-align: center;
    line-height: 2.5em;
    transition: all .2s;
    
    &.hide {
      transition: all .2s;
      opacity: 0;
    }
  }
}
</style>
