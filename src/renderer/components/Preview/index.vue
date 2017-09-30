<template>
  <div class="container">
    <img :src="image" alt="preview" id="preview">
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  props: [],
  components: {},

  data () {
    return {
      image: ''
    }
  },

  methods: {},
  mounted () {
    this.image = this.$route.query.image
    console.log(this.image)
  },
  created () {
    window.addEventListener('keyup', (e) => {
      if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) && (e.target.nodeName === 'BODY')) {
        e.preventDefault()
        window.close()
        return false
      }
    })

    ipcRenderer.on('show-image-preview', (event, args) => {
      this.image = args.image
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: calc(100vh - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: scroll;
  background: #444444;

  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
}
</style>
