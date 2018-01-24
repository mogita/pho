<template>
  <div class="profile-container">
    <div class="resume-container">

      <div class="background">
        <img :src="profile.profile_background_image_url">
      </div>

      <div class="inner">
        <div class="left-wrapper">
          <img :src="profile.profile_image_url_large" :class="{male: profile.gender === '男', female: profile.gender === '女'}">
          <div class="follow">
            <div class="follow-btn" :class="{following: profile.following === true}"  @mouseover="followBtnText = (profile.following) ? '取消关注' : ''" @mouseout="followBtnText = (profile.following) ? '关注中' : ''">
              <span v-if="profile.following">{{followBtnText || '关注中'}}</span>
              <span v-else>关注</span>
            </div>
          </div>
        </div>

        <div class="center-wrapper">
          <p class="screen-name">{{profile.screen_name}}</p>
          <p class="id"><span v-if="profile.protected === true"><i class="fa fa-lock"></i>&nbsp;</span>{{profile.id}}</p>
          <p class="location"><i class="fa fa-globe" v-if="profile.location"></i>&nbsp;{{profile.location}}</p>
          <p class="bio" v-html="filterLineBreaks(profile.description)"></p>
          <p class="url" v-if="profile.url" @click="handleLinkClick">{{profile.url}}</p>
        </div>

        <div class="right-wrapper">
          <div class="op-btn">
            <i class="fa fa-reply"></i>
          </div>

          <div class="op-btn">
            <i class="fa fa-envelope-o"></i>
          </div>
        </div>
      </div>

    </div>

    <div class="accumulation-container">
      <div class="inner">
        <div class="count following">
          <div class="label">正在关注</div>
          <div class="figure">{{this.profile.friends_count}}</div>
        </div>
        <div class="count follower">
          <div class="label">关注者</div>
          <div class="figure">{{this.profile.followers_count}}</div>
        </div>
        <div class="count status" @click="handleStatusesCountClick">
          <div class="label">饭文</div>
          <div class="figure">{{this.profile.statuses_count}}</div>
        </div>
      </div>
    </div>

    <div class="recent-statuses-container">
      <div class="title">
        最近饭文
      </div>
      <div class="timeline">
        <Card v-for="item in timeline" v-if="item.hasOwnProperty('user')" :item="item" :id="item.id" :key="'profile-' + item.id" :belongsTo="belongsTo"></Card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './../Timeline/Card'

export default {
  name: 'profile',
  props: ['args', 'belongsTo'],
  components: {
    Card
  },
  computed: {},
  watch: {},
  data () {
    return {
      followBtnText: '',
      timeline: [],
      profile: {
        id: null,
        name: '',
        screen_name: '',
        unique_id: '',
        location: '',
        gender: '',
        birthday: '',
        description: '',
        profile_image_url: '',
        profile_image_url_large: '',
        url: '',
        protected: false,
        followers_count: 0,
        friends_count: 0,
        favourites_count: 0,
        statuses_count: 0,
        photo_count: 0,
        following: false,
        notifications: false,
        created_at: '',
        utc_offset: 28800,
        profile_background_color: '#FFFFFF',
        profile_text_color: '#222222',
        profile_link_color: '#0982EC',
        profile_sidebar_fill_color: '#EEF522',
        profile_sidebar_border_color: '#CD2A7B',
        profile_background_image_url: '',
        profile_background_tile: false,
        status: null
      }
    }
  },
  methods: {
    filterLineBreaks (input) {
      return input.trim().replace(/\r?\n|\r/gmi, '<br />')
    },
    handleLinkClick (e) {
      this.$pho.openExternalLink(e.target.innerText)
    },
    handleStatusesCountClick () {
      this.$bus.$emit(`timeline.${this.belongsTo}.view.push`, {
        component: 'timelineGeneric',
        title: this.profile.screen_name,
        args: {
          id: this.profile.id,
          type: 'user_statuses_list'
        },
        nonce: Math.random().toString().replace('.', ''),
        belongsTo: this.belongsTo
      })
    }
  },
  async mounted () {
    this.profile = await this.$pho.getUserProfile(this.args.id)
    this.timeline = await this.$pho.getUserTimeline(this.args.id, 5)
  }
}
</script>

<style lang="scss" scoped>
.profile-container {
  background-color: #ffffff;
  height: calc(100vh - 110px);
  overflow-y: scroll;
  overflow: overlay;

  .resume-container {
    position: relative;
    height: 280px;
    width: 100%;
    overflow: hidden;
    user-select: none;
    cursor: default;
    background-color: rgba(170, 170, 170, 1);

    .background {
      height: 100%;
      width: 100%;

      img {
        position: absolute;
        top: -10px;
        left: -10px;
        height: calc(100% + 20px);
        width: calc(100% + 20px);
        object-fit: cover;
        object-position: center center;
        filter: blur(5px) brightness(60%);
      }
    }

    .inner {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      padding-top: 2em;
      display: flex;
      flex-direction: row;

      .left-wrapper {
        padding-left: 2em;

        img {
          width: 80px;
          height: 80px;
          border-radius: 3px;
          user-select: none;
          background: url('./../../assets/images/generic_avatar.png') no-repeat;
          background-size: cover;
          background-position: center center;
          border: 3px solid #ffffff;

          &.male {
            border: 3px solid rgba(100, 200, 255, .8);
          }

          &.female {
            border: 3px solid rgba(255, 160, 160, .8);
          }
        }

        .follow {
          width: 90%;
          margin: 18px auto 0;

          .follow-btn {
            text-align: center;
            font-size: 12px;
            line-height: 20px;
            color: #44ddff;
            border: 1px solid #44ddff;
            border-radius: 3px;
            height: 20px;
            width: 100%;

            &:active {
              color: #66eeff;
              border: 1px solid #66eeff;
            }

            &.following {
              color: #88ccff;
              border: 1px solid #88ccff;

              &:hover {
                color: #ff9999;
                border: 1px solid #ff9999;
              }

              &:active {
                color: #ffaaaa;
                border: 1px solid #ffaaaa;
              }
            }
          }
        }
      }

      .center-wrapper {
        flex-grow: 1;
        color: #ffffff;
        font-size: 12px;
        padding: 0 24px;

        .screen-name {
          font-size: 18px;
        }

        .id {
          font-size: 11px;
          color: rgba(235, 235, 235, 0.8);
        }

        .location {
          color: rgba(255, 255, 255, 0.8);
          margin: 8px 0;
        }

        .bio {
          max-height: 138px;
          overflow-x: hidden;
          overflow-y: scroll;
          user-select: text;

          &::-webkit-scrollbar { 
            display: none;
          }
        }

        .url {
          cursor: default;
          margin-top: 8px;
          color: #00ccff;

          &:active {
            color: #44ddff;
          }
        }
      }

      .right-wrapper {
        padding-right: 2em;

        .op-btn {
          margin-bottom: 6px;
          color: #ffffff;

          &:active {
            color: #cfcfcf;
          }
        }
      }
    }
  }

  .accumulation-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    user-select: none;
    cursor: default;
    background-color: #f3f3f3;

    .inner {
      width: 100%;
      max-width: 480px;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      justify-content: center;

      .count {
        display: flex;
        flex-direction: column;
        margin: 8px 0;
        padding: 0 32px;
        text-align: center;
        border-right: 1px solid #cfcfcf;
        color: #555555;

        &:last-child {
          border: none;
        }

        .label {
          font-size: 12px;
        }
      }
    }
  }

  .recent-statuses-container {
    position: relative;
    width: 100%;
    
    .title {
      color: #a3a3a3;
      font-size: 14px;
      font-weight: 700;
      padding: 8px 13px;
      user-select: none;
      cursor: default;
    }
  }
}
</style>
