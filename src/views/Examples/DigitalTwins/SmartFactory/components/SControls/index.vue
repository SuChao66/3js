<template>
  <el-button size="large" plain round @click="handlePlay">
    {{ isPlaying ? '暂停' : '播放' }}
  </el-button>
  <el-button size="large" plain round @click="handleEnvironment('rain')">
    下雨
  </el-button>
  <el-button size="large" plain round @click="handleEnvironment('snow')">
    下雪
  </el-button>
  <el-button size="large" plain round @click="handleFly">
    {{ isFlyPlaying ? '退出巡厂' : '无人机巡场' }}
  </el-button>
  <el-button size="large" plain round @click="handleRoaming">
    {{ isRoaming ? '退出漫游' : '宇宙漫游' }}
  </el-button>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
// 导入类型
import type { IProps } from './types'

// 1.定义props和emits
const emit = defineEmits([
  'handlePlay',
  'handleEnvironment',
  'handleFly',
  'handleRoaming'
])
const props = withDefaults(defineProps<IProps>(), {
  isPlaying: false,
  isFlyPlaying: false,
  isRoaming: false
})
const { isPlaying, isFlyPlaying, isRoaming } = toRefs(props)

const handlePlay = () => {
  emit('handlePlay')
}
const handleEnvironment = (type: string) => {
  emit('handleEnvironment', type)
}
const handleFly = () => {
  emit('handleFly')
}
const handleRoaming = () => {
  emit('handleRoaming')
}
</script>

<style lang="less" scoped></style>
