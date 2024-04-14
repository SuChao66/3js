<template>
  <div class="container">
    <img :src="tagBg" alt="" class="bg-img" />
    <div class="top">
      <div class="title">
        <span id="name">{{ title }}</span>
      </div>
      <div class="m15">
        <span class="number">{{ counter }} L</span>
      </div>
    </div>
    <div class="right">
      <span :class="status === -1 ? 'error' : 'normal'">
        {{ status === -1 ? '异常' : '正常' }}
      </span>
    </div>
    <div class="close">
      <img id="close" :src="close" class="close-icon" @click="handleClose" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入图片
import tagBg from '@/assets/images/tag-bg.png'
import close from '@/assets/images/close-icon.png'
// 导入类型
import type { IProps } from './types'

const emit = defineEmits(['handleClose'])
const props = withDefaults(defineProps<IProps>(), {
  title: '默认标题',
  counter: 0,
  status: 0
})
const { title, counter, status } = toRefs(props)

const handleClose = () => {
  emit('handleClose')
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
