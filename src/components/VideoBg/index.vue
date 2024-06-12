<template>
  <div class="video-bg">
    <video
      autoplay
      muted
      class="bg1"
      ref="video1"
      :style="{ display: isDisplay ? 'block' : 'none' }"
    >
      <source :src="myVideo1" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <video
      autoplay
      muted
      loop
      class="bg2"
      :style="{ display: isDisplay ? 'none' : 'block' }"
    >
      <source :src="myVideo2" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<script setup lang="ts">
// 导入视频资源
import myVideo1 from '@/assets/images/video/big-video-1.mp4'
import myVideo2 from '@/assets/images/video/big-video-2.mp4'

const video1 = ref(null)
const video2 = ref(null)
const isDisplay = ref(true)

onMounted(() => {
  video1.value.addEventListener(
    'ended',
    function () {
      isDisplay.value = false
    },
    false
  )
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
