<template>
  <div class="s-controls">
    <!-- 旋转 -->
    <el-button round plain size="large" @click="handleRotate">
      <template v-if="isRotate">
        <svg-icon icon-class="rotate"></svg-icon>
      </template>
      <template v-else>
        <svg-icon icon-class="stopRotate"></svg-icon>
      </template>
      <span class="text">{{ isRotate ? '停止旋转' : '开始旋转' }}</span>
    </el-button>
    <!-- 变色 -->
    <el-button round plain size="large" @click="handleChangeColor">
      <svg-icon icon-class="colorPlane"></svg-icon>
      <span class="text">{{ isChangeColor ? '停止变色' : '开始变色' }}</span>
    </el-button>
    <!-- 播放背景音乐 -->
    <el-button round plain size="large" @click="handleMusic">
      <template v-if="isPlayBackgroundVoice">
        <svg-icon icon-class="stopMusic"></svg-icon>
      </template>
      <template v-else>
        <svg-icon icon-class="playMusic"></svg-icon>
      </template>
      <span class="text">{{
        isPlayBackgroundVoice ? '关闭音乐' : '播放音乐'
      }}</span>
    </el-button>
    <!-- 开车灯 -->
    <el-button round plain size="large" @click="handleCarLight">
      <svg-icon icon-class="carLight"></svg-icon>
      <span class="text">{{ isOpenLight ? '关闭车灯' : '打开车灯' }}</span>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
// 导入类型
import type { IProps } from './types'

// 0.定义props和emits
const emits = defineEmits([
  'handleRotate',
  'handleChangeColor',
  'handleMusic',
  'handleCarLight'
])
const props = withDefaults(defineProps<IProps>(), {
  isChangeColor: false, // 是否正在变色
  isRotate: false, // 是否正在旋转
  isPlayBackgroundVoice: false, // 是否播放背景音乐
  isOpenLight: false // 是否打开车灯
})
const { isChangeColor, isRotate, isPlayBackgroundVoice, isOpenLight } =
  toRefs(props)

// 处理旋转事件
const handleRotate = () => {
  emits('handleRotate')
}
// 处理改变颜色事件
const handleChangeColor = () => {
  emits('handleChangeColor')
}
// 处理背景音乐事件
const handleMusic = () => {
  emits('handleMusic')
}
// 处理汽车车灯事件
const handleCarLight = () => {
  emits('handleCarLight')
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
