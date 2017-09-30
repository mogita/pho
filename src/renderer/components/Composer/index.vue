<template>
  <div class="container">
    <div class="status-composer-content">
      <textarea class="status-text-input" id="status-text-input" v-model="draft" @keydown.enter="keyup($event)" placeholder="你在做什么"></textarea>
      <div class="clear-image" @click="imageFilePath = null" v-if="imageFilePath">
        <i class="fa fa-fw fa-trash"></i>
      </div> 
      <img :src="'file://' + imageFilePath" alt="preview" class="image-preview" v-if="imageFilePath">
    </div>
    <div class="status-composer-controls">
      <div class="control">
        <i class="fa fa-image" @click="chooseImage"></i>
      </div>
      <div class="counter" :class="(remainingLength.exceeded) ? 'danger' : ''">
        {{ remainingLength.counterText }}
      </div>

      <div class="send-button" @click="sendNewStatus">发送</div>
    </div>
  </div>
</template>

<script>
import { remote, ipcRenderer, webFrame } from 'electron'
import api from './../../api'
const dialog = remote.dialog

export default {
  props: [],
  components: {},
  computed: {},
  watch: {
    draft (after) {
      // update remaining length
      let length = 140 - after.length

      if (length >= 0) {
        this.remainingLength.exceeded = false
        this.remainingLength.counterText = `还可以写 ${length} 字`
      } else {
        this.remainingLength.exceeded = true
        this.remainingLength.counterText = `已超出 ${Math.abs(length)} 字，超出部分将被丢弃`
      }
    }
  },
  data () {
    return {
      action: 'new',
      draft: '',
      refStatusId: null,
      refUserId: null,
      imageFilePath: null,
      remainingLength: {
        exceeded: false,
        counterText: '还可以写 140 字'
      }
    }
  },
  methods: {
    keyup (e) {
      if (e.metaKey || e.ctrlKey) {
        this.sendNewStatus()
      }
    },

    setCursorPos (position) {
      let input = document.getElementById('status-text-input')
      input.setSelectionRange(position, position)
      input.focus()
    },

    chooseImage () {
      let image = dialog.showOpenDialog({properties: ['openFile'], filters: [{name: 'Images', extensions: ['jpg', 'png', 'gif']}]})
      if (Array.isArray(image) && typeof image[0] === 'string') {
        this.imageFilePath = image[0]
      }
    },

    sendNewStatus () {
      if (this.imageFilePath) {
        api.sendNewPhoto(this.draft, this.imageFilePath)
          .then(() => {
            ipcRenderer.send('close-status-composer')
          })
          .catch((err) => console.error(err))
      } else {
        let args = {}
        switch (this.action) {
          case 'new':
            break
          case 'repost':
            args.repostStatusId = this.refStatusId
            break
          case 'reply':
            args.inReplyToStatusId = this.refStatusId
            args.inReplyToUserId = this.refUserId
            break
          default:
            break
        }
        api.sendNewStatus(this.draft, args)
          .then(() => {
            ipcRenderer.send('close-status-composer')
          })
          .catch((err) => console.error(err))
      }
    }
  },
  mounted () {},
  created () {
    webFrame.setVisualZoomLevelLimits(1, 1)
    ipcRenderer.on('show-status-composer', (event, args) => {
      this.action = args.action || 'new'
      this.draft = args.draft || ''
      this.refStatusId = args.refStatusId || null
      this.refUserId = args.refUserId || null
      this.$nextTick(() => {
        this.setCursorPos(args.cursorPos || 0)
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  background: #ffffff;
}

.status-composer-content {
  height: 100%;
  display: flex;

  .status-text-input {
    flex: 1;
    resize: none;
    font-size: 12px;
    color: #3a3a3a;
    padding: 10px;
    border: none;
    box-sizing: border-box;
  }

  .clear-image {
    margin: 0;
    padding: 0;
    position: absolute;
    right: 0;
    color: #808080;
    cursor: pointer;
  }

  .clear-image:hover {
    color: #505050;
  }

  .clear-image:active {
    color: #707070;
  }

  .image-preview {
    user-select: none;
    background: #ffffff;
    object-fit: contain;
    padding: 8px 10px 0;
    height: 90px;
    width: 90px;
  }
}

.status-composer-controls {
  background: #ffffff;
  height: 60px;
  width: 100%;
  user-select: none;
  display: flex;
  align-items: center;

  .control {
    cursor: pointer;
    padding-left: 12px;
    color: #666666;
  }

  .control:hover {
    color: #444444;
  }

  .control:active {
    color: #222222;
  }

  .counter {
    margin-left: auto;
    margin-right: 20px;
    font-size: 12px;
    user-select: none;
    cursor: default;
    color: #a0a0a0;
    transition: all .3s;
  }

  .counter.danger {
    color: tomato;
  }

  .send-button {
    font-size: 12px;
    padding: 3px 10px;
    margin-right: 12px;
    border-radius: 3px;
    background-color: #00ccff;
    color: #ffffff;
    user-select: none;
    cursor: default;
  }

  .send-button:hover {
    background-color: #00bbea;
  }

  .send-button:active {
    background-color: #00afdb;
  }
}

.fa-rotate-45 {
  transform: rotate(45deg);
}
</style>
