<template>
  <div id="camera" class="camera-tag" style="display: none">
    <div>
      <div
        style="height: 1px; width: 100px; background: #00ffff; margin-top: 68px"
      ></div>
    </div>
    <div id="message" style="width: 300px; height: 130px">
      <div style="padding: 10px 4px; font-size: 18px">双摄像头</div>
      <div style="padding: 10px 24px; font-size: 16px">
        后置主摄像头——1300万像素(F/1.8光圈)
      </div>
      <div style="padding: 10px 24px; font-size: 16px">
        后置副摄像头——200万像素的
      </div>
    </div>
    <!-- 设置一个关闭按钮 -->
    <div style="position: relative">
      <div style="position: absolute; left: -30px; top: 10px">
        <img
          @click="handleClose"
          id="close"
          :src="close"
          alt=""
          width="18"
          style="cursor: pointer"
          class="img"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import close from '@/assets/images/关闭.png'

const emits = defineEmits(['handleClose'])
const handleClose = () => {
  emits('handleClose')
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
