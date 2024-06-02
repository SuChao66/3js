<template>
  <div class="big-screen-header">
    <img :src="headerBg" alt="" />
    <div class="title">{{ title }}</div>
  </div>
</template>

<script setup lang="ts">
// 导入图片
import headerBg from '@/assets/images/head_bg.png'
// 导入类型
import type { IProps } from './types'

const props = withDefaults(defineProps<IProps>(), {
  title: '默认标题'
})
const { title } = toRefs(props)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
