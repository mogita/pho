<template>
  <div class="container">
    <div class="spacer"></div>
    <div class="status-area" @click="hideCraftStatus">
      <div class="box" @click.stop>
        <div class="box-header">
          <h5>你在做什么？</h5>
        </div>
        <div class="box-body">
          <textarea class="status-input" rows="5" id="craft-status" placeholder="消息内容" :value="statusContent" @input="updateStatusContent" @keydown.enter="keyup($event)"></textarea>
          <img :src="'file://' + imageFilePath" alt="preview" class="image-preview" v-if="imageFilePath">
        </div>
        <div class="box-footer">
          <div class="controls">
            <i class="fa fa-image" @click="chooseImage"></i>
          </div>

          <div class="counter" :class="(remainingLength.exceeded) ? 'danger' : ''">
            {{ remainingLength.counterText }}
          </div>

          <div class="send-button" @click="sendNewStatus">发送</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../../store'
import { mapGetters, mapActions } from 'vuex'
import api from '../../api'
import { remote } from 'electron'
const dialog = remote.dialog

export default {
  store,

  data () {
    return {}
  },

  computed: {
    ...mapGetters([
      'showCraftStatus',
      'statusContent',
      'imageFilePath',
      'remainingLength',
      'inReplyToStatusId',
      'inReplyToUserId',
      'repostStatusId',
      'statusLocation'
    ])
  },

  methods: {
    ...mapActions([
      'setShowCraftStatus',
      'setStatusContent',
      'setImageFilePath',
      'setInReplyToStatusId',
      'setInReplyToUserId',
      'setRepostStatusId',
      'setStatusLocation',
      'resetAll'
    ]),

    updateStatusContent (e) {
      this.setStatusContent(e.target.value)
    },

    hideCraftStatus () {
      this.setShowCraftStatus(false)
    },

    sendNewStatus () {
      if (this.imageFilePath) {
        api.sendNewPhoto()
          .then(_ => {
            this.resetAll()
            this.hideCraftStatus()
            // a short latency for timeline api to return the status just posted
            setTimeout(_ => {
              api.getHomeTimeline()
            }, 700)
          })
          .catch((err) => console.error(err))
      } else {
        api.sendNewStatus()
          .then(_ => {
            this.resetAll()
            this.hideCraftStatus()
            // a short latency for timeline api to return the status just posted
            setTimeout(_ => {
              api.getHomeTimeline()
            }, 700)
          })
          .catch((err) => console.error(err))
      }
    },

    keyup (e) {
      if (e.metaKey || e.ctrlKey) {
        this.sendNewStatus()
      }
    },

    setFocus (position) {
      let input = document.getElementById('craft-status')
      input.setSelectionRange(position, position)
      input.focus()
    },

    chooseImage () {
      let image = dialog.showOpenDialog({properties: ['openFile'], filters: [{name: 'Images', extensions: ['jpg', 'png', 'gif']}]})
      if (Array.isArray(image) && typeof image[0] === 'string') {
        this.setImageFilePath(image[0])
      }
    }
  },
  created () {
    this.$bus.$on('setFocus', this.setFocus)
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        e.preventDefault()
        this.hideCraftStatus()
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.spacer {
  flex: 0 0 40px;
  background: rgba(255, 255, 255, .4);
}

.status-area {
  width: 100vw;
  height: 100%;
  background-color: rgba(255, 255, 255, .8);
  display: flex;
  align-items: flex-start;
}

.box {
  width: 100vw;
  max-width: 460px;
  background-color: #ffffff;
  margin: 15px auto 0;
  border: 1px solid #555555;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
}

.box-header {
  flex: 0 0 40px;
  background-color: #555555;
  display: flex;
  align-items: center;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.box-header h5 {
  margin-left: 10px;
  font-size: 14px;
  color: #ffffff;
  user-select: none;
  cursor: default;
}

.box-body {
  flex: 0 0 100%;
  display: flex;

  .image-preview {
    object-fit: cover;
    padding: 8px 10px 0;
    height: 90px;
    width: 90px;
  }
}

.status-input {
  flex: 1;
  color: #444444;
  font-size: 14px;
  padding: 10px;
  resize: none;
  border: none;
}

.box-footer {
  flex: 0 0 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-top: 1px solid #efefef;
}

.box-footer .controls {
  color: #666666;
}

.box-footer .controls:hover {
  color: #444444;
}

.box-footer .controls:active {
  color: #222222;
}

.box-footer .counter {
  margin-left: auto;
  margin-right: 20px;
  font-size: 12px;
  user-select: none;
  cursor: default;
  transition: all .3s;
}

.box-footer .counter.danger {
  color: tomato;
}

.box-footer .send-button {
  font-size: 14px;
  padding: 8px 18px;
  border-radius: 3px;
  background-color: #00ccff;
  color: #ffffff;
  user-select: none;
  cursor: default;
}

.box-footer .send-button:hover {
  background-color: #00bbea;
}

.box-footer .send-button:active {
  background-color: #00afdb;
}
</style>
