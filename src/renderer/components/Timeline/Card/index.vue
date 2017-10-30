<template>
  <div class="container" :id="`${belongsTo}-${id}`" v-on:mouseenter="setFocus(true)" v-on:mouseleave="setFocus(false)">
    <div class="avatar">
      <img :src="item.user.profile_image_url_large" alt="avatar">
    </div>

    <div class="content">
      <div class="headline">
        <h6 class="nickname">{{ item.user.screen_name }} <small>@{{item.user.id}} {{item.id}}</small></h6>
        <div class="created_at" v-show="!isFocus">{{ created_at }} <i class="fa fa-star fav" v-if="item.favorited === true"></i></div>
        <div class="controls" v-show="isFocus">
          <i class="fa fa-reply" @click="reply"></i>
          <i class="fa fa-retweet" @click="repost"></i>
          <i class="fa fa-star" :class="(item.favorited === true) ? 'fav' : ''" @click="toggleFav"></i>
          <i class="fa fa-trash" v-if="item.is_self" @click="deleteStatus"></i>
        </div>
      </div>

      <div class="message" v-html="getUnescapedText()"></div>
      <div class="image-preview" v-if="typeof item.photo === 'object'">
        <div class="image-mask" v-if="loadingImage"><i class="fa fa-circle-o-notch fa-spin"></i></div>
        <img :src="item.photo.largeurl" alt="preview" @click="popupImage(item.photo.originurl)">
      </div>
      <div class="meta">
        <span class="via">
          发自
          <a class="source" v-if="typeof item.source_url == 'string' && item.source_url.length > 0" :href="item.source_url " target="_blank">
            {{ item.source_name }}
          </a>
          <span class="source" v-else>{{ item.source_name }}</span>
        </span>
        <span v-if="item.type == 'repost'">
          转自 <span v-if="item.type == 'repost'">{{ item.repost_screen_name }}</span>
        </span>
        <span v-if="item.type == 'reply'">
          回复给 <i v-if="item.type == 'reply'">{{ item.in_reply_to_screen_name }}</i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { remote, ipcRenderer } from 'electron'
import moment from 'moment'
moment.locale('zh-cn')

function createWindow (width, height, imageUrl) {
  const winUrl = remote.getGlobal('winUrl')
  let window = new remote.BrowserWindow({
    height,
    width,
    minHeight: height,
    minWidth: width,
    frame: false,
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      webSecurity: false,
      devTools: false,
      zoomFactor: 1
    },
    show: false
  })

  window.loadURL(winUrl + '#preview?image=' + imageUrl)
  window.on('close', () => {
    window = null
  })

  return window
}

export default {
  name: 'message-card',
  props: ['id', 'item', 'belongsTo'],
  data () {
    return {
      created_at: moment(Date.parse(this.item.created_at)).fromNow(),
      loadingImage: false,
      isFocus: false,
      clientBottom: null
    }
  },
  computed: {},
  methods: {
    getUnescapedText () {
      return '<span class="inner-message">' + this.item.text.replace(/\n/g, '<br>').replace(/([\uD83C-\uDBFF\uDC00-\uDFFF]+)/g, '<span style="letter-spacing: 4px;">$1</span>') + '</span>'
    },
    popupImage (url) {
      this.loadingImage = true
      this.getImageSize(url)
        .then(res => {
          let maxHeight = 800
          let maxWidth = 1000
          let height = res.height
          let width = res.width

          if (width > maxWidth) {
            let ratio = maxWidth / width
            width = maxWidth
            height = height * ratio
          }

          if (height > maxHeight) {
            let ratio = maxHeight / height
            height = maxHeight
            width = width * ratio
          }

          const window = createWindow(width, height, url)
          window.on('ready-to-show', () => {
            window.show()
            window.focus()

            this.loadingImage = false
          })
        })
        .catch(err => {
          this.loadingImage = false
          console.error(err)
        })
    },
    getImageSize (url) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.onload = function () {
          return resolve({width: this.width, height: this.height + 40}) // 40px for compensation of fixed bar
        }
        img.src = url
      })
    },
    reply () {
      ipcRenderer.send('show-status-composer', {
        draft: `@${this.item.user.screen_name} `,
        action: 'reply',
        refStatusId: this.item.id,
        refUserId: this.item.user.id,
        cursorPos: 140
      })
    },
    repost () {
      ipcRenderer.send('show-status-composer', {
        draft: `转@${this.item.user.screen_name} ${this.stripHTML(this.item.text)}`,
        action: 'repost',
        refStatusId: this.item.id
      })
    },
    toggleFav () {
      this.$pho.toggleFav(this.item.favorited, this.item.id)
    },
    deleteStatus () {
      if (confirm('确实要删除这条消息吗？')) {
        this.$pho.deleteStatus(this.item.id)
      }
    },
    stripHTML (html) {
      let tmp = document.createElement('div')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    },
    setFocus (value) {
      this.isFocus = value
    },
    scrollHandler () {
      // as this card enters the viewport (below top bar over 80px) mark this card "read"
      if (this.$el.getBoundingClientRect().top - 80 >= -1) {
        if (this.belongsTo === 'home') this.$store.dispatch('timelineHome/markRead', this.id)
        else if (this.belongsTo === 'mention') this.$store.dispatch('timelineMention/markRead', this.id)
        this.$bus.$off(`timeline.scrolled.${this.belongsTo}`, this.scrollHandler)
      }
    }
  },
  mounted () {
    this.$nextTick(_ => {
      // add event listener if this card is still "unread"
      let getterName
      if (this.belongsTo === 'home') getterName = 'timelineHome/unreadIds'
      else if (this.belongsTo === 'mention') getterName = 'timelineMention/unreadIds'
      if (~this.$store.getters[getterName].indexOf(this.id)) {
        // turn off event listener for scroll to mark read
        this.$bus.$off(`timeline.scrolled.${this.belongsTo}`, this.scrollHandler)
        this.$bus.$on(`timeline.scrolled.${this.belongsTo}`, this.scrollHandler)
      }
    })
  },
  beforeDestroy () {
    // turn off event listener for scroll to mark read
    this.$bus.$off(`timeline.scrolled.${this.belongsTo}`, this.scrollHandler)
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: top;
  border-bottom: 1px solid #f0f0f0;
  cursor: default;
  user-select: none;
}

.container:hover {
  background-color: #f9f9f9;
}

.avatar {
  flex: 0 0 1;
  padding: 12px;
  /*background-color: red;*/
}

.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 3px;
  user-select: none;
  background: url('./../../../assets/images/generic_avatar.png') no-repeat;
  background-size: cover;
  background-position: center center;
}

.content {
  flex: 1;
  padding: 9px 15px 15px 0;
  // background-color: yellow;
}

.controls {
  display: flex;
  flex-direction: row;
  /*background-color: blue;*/
  align-items: center;
  height: 20px;
}

.controls i {
  color: #888888;
  padding: 0 3px 6px 3px;
  font-size: 12px;
}

.controls i:hover {
  color: #4286f4;
}

.controls i:active {
  color: #1968e8;
}

i.fav {
  color: gold;
}

.controls i.fav:hover {
  color: #ffd000;
}

.controls i.fav:active {
  color: #b79500;
}

.controls .fa-reply {
  font-size: 10px;
}

.headline {
  display: flex;
  justify-content: space-between;
  height: 20px;
}

.created_at {
  font-size: 10px;
  color: #aaaaaa;
  padding-right: 3px;

  .fa {
    font-size: 12px;
  }
}

.nickname {
  /*background-color: green;*/
  display: inline-block;
  padding: 0 3px;
  font-size: 14px;

  small {
    font-weight: 400;
    color: #999999;
  }
}

.message {
  padding: 0 3px 0 3px;
  margin-top: 1px;
  font-size: 14px;
  color: #444444;
  line-height: 22px;
  word-wrap: break-word;
  word-break: break-all;
}

.image-preview {
  position: relative;
  margin-top: 8px;
  display: flex;
  width: 100%;
  max-width: 640px;
  height: 220px;

  .image-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 30px;
    border-radius: 5px;

    .fa {
      align-self: center;
    }
  }

  img {
    object-fit: cover;
    width: 100%;
    border-radius: 5px;
    cursor: zoom-in;
  }
}

.meta {
  margin-top: 8px;
  padding: 0 0 0 3px;
  font-size: 10px;
  color: #cccccc;
}

.meta .via .source {
  text-decoration: none;
  color: #b7b7b7;
  font-weight: bold;
}
</style>
