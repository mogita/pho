<template>
  <div class="search-wrapper">
    <div class="input-field">
      <input type="text" @keydown.enter="handleSearchSubmit" placeholder="Type in keyword and hit Enter">
    </div>
  </div>
</template>

<script>
export default {
  props: ['belongsTo'],
  components: {},
  computed: {},
  watch: {},
  data () {
    return {}
  },
  methods: {
    handleSearchSubmit (e) {
      const keyword = e.target.value
      this.$bus.$emit(`timeline.${this.belongsTo}.view.push`, {
        component: 'timelineGeneric',
        title: keyword,
        args: {
          keyword,
          type: 'search'
        },
        nonce: Math.random().toString().replace('.', ''),
        belongsTo: this.belongsTo
      })
    }
  },
  mounted () {}
}
</script>

<style lang="scss" scoped>
.search-wrapper {
  background: #f3f3f3;
  min-height: 100vh;

  .input-field {
    height: 24px;
    width: 100%;

    input {
      height: 100%;
      width: 100%;
      border: none;
      padding: 4px 8px;
    }
  }
}
</style>
