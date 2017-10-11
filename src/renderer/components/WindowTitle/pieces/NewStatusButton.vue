<template>
  <div>
    <div class="new-status" @click="setShowCraftStatus"><i class="fa fa-pencil-square-o fa-fw"></i></div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'

export default {
  methods: {
    setShowCraftStatus () {
      ipcRenderer.send('show-status-composer', {
        draft: '',
        action: 'new'
      })
    }
  }
}
</script>

<style scoped>
.new-status {
  color: #555555;
  font-size: 18px;
  padding: 5px 10px 5px 5px;
}

.new-status:hover {
  color: #777777;
}

.new-status:active {
  color: #999999;
}
</style>
