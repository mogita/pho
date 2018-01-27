<template>
  <div class="search-wrapper">
    <div class="search-bar">
      <input type="text" @keydown.enter="handleSearchSubmit" placeholder="Type in keyword and hit Enter">
    </div>

    <div class="trends-list">
      <div class="title">热门话题</div>
      <div class="trends-chips">
        <template v-for="trend in trendsList">
          <div class="item" @click="handleSearchSubmit(trend.query)" :key="trend.name">{{trend.name}}</div>
        </template>
      </div>
    </div>

    <div class="saved-keywords-list">
      <div class="title">关注的话题</div>
      <div class="saved-keywords-chips">
        <template v-for="keyword in savedSearches">
          <div class="item" @click="handleSearchSubmit(keyword.query)" :key="keyword.name">
            {{keyword.name}}
            <i class="fa fa-times-circle delete-btn" @click.prevent.stop="handleDeleteKeyword(keyword.id, keyword.name)"></i>
          </div>
        </template>
      </div>
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
    return {
      trendsList: [],
      savedSearches: []
    }
  },
  methods: {
    async refreshTrends () {
      const trends = await this.$pho.getTrendsList()
      if (trends.trends && Array.isArray(trends.trends)) {
        this.trendsList = trends.trends
      }
    },
    async refreshSavedSearches () {
      const savedSearches = await this.$pho.getSavedSearchesList()
      if (Array.isArray(savedSearches)) {
        this.savedSearches = savedSearches
      }
    },
    handleSearchSubmit (keyword) {
      if (typeof keyword === 'object' && keyword.target.value) {
        keyword = keyword.target.value
      }

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
    },
    async handleDeleteKeyword (id, name) {
      if (confirm(`Are you sure you want to delete "${name}"?`)) {
        if (await this.$pho.deleteSavedSearch(id)) {
          this.refreshSavedSearches()
        } else {
          alert(`Failed to delete "${name}"`)
        }
      }
    }
  },
  mounted () {
    this.refreshTrends()
    this.refreshSavedSearches()
  }
}
</script>

<style lang="scss" scoped>
.search-wrapper {
  background: #f3f3f3;
  min-height: 100vh;

  .search-bar {
    background: #ffffff;
    padding: 8px 0;
    width: 100%;

    input {
      height: 100%;
      width: 100%;
      border: none;
      padding: 4px 8px;
    }
  }

  .trends-list {
    width: 100%;
    padding: 12px 0 0;

    .title {
      color: #a3a3a3;
      font-size: 14px;
      font-weight: 700;
      padding: 8px 13px;
      user-select: none;
      cursor: default;
    }

    .trends-chips {
      padding: 8px 13px;
      font-size: 12px;

      .item {
        display: inline-block;
        border: 1px solid #60ccf6;
        border-radius: 4px;
        padding: 8px 12px;
        margin-right: 8px;
        background: #ffffff;
        color: #555555;
        transition: all .2s;
        user-select: none;
        cursor: default;
      }

      .item:hover {
        background: #f4f4f4;
      }

      .item:active {
        background: #efefef;
      }
    }
  }

  .saved-keywords-list {
    width: 100%;
    padding: 12px 0 0;

    .title {
      color: #a3a3a3;
      font-size: 14px;
      font-weight: 700;
      padding: 8px 13px;
      user-select: none;
      cursor: default;
    }

    .saved-keywords-chips {
      padding: 8px 13px;
      font-size: 12px;

      .item {
        position: relative;
        display: inline-block;
        border: 1px solid #60ccf6;
        border-radius: 4px;
        padding: 8px 12px;
        margin-right: 8px;
        background: #ffffff;
        color: #555555;
        transition: all .2s;
        user-select: none;
        cursor: default;

        &:hover {
          background: #f4f4f4;

          .delete-btn {
            display: block;
          }
        }

        &:active {
          background: #efefef;
        }
      }

      .delete-btn {
        display: none;
        position: absolute;
        right: -7px;
        top: -8px;
        font-size: 15px;
        background: #ffffff;
        color: rgba(255, 55, 55, 0.3);
        border-radius: 100px;

        &:hover {
          color: #ff5555;
        }

        &:active {
          color: #dd2222;
        }
      }
    }
  }
}
</style>
