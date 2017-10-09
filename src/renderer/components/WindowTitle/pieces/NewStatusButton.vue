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
      // uiBus.toast('单数之中质数最美，不过的确考虑养两只🐈 转@世界这么大 猫这种动物还是两只一起养心理比较健康，猫跟狗完全不能平等交流，有种族歧视。', '吐司标题')
      // store.dispatch('resetAll')
      // store.dispatch('setShowCraftStatus', true)
      // this.$nextTick(_ => {
      //   this.$bus.$emit('setFocus', 0)
      // })
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
