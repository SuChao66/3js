<template>
  <div class="s-box" :style="{ backgroundColor: bgColor }">
    <div class="title" v-if="title">默认标题</div>
    <img :src="leftTop" alt="" class="icon leftTop" />
    <img :src="rightTop" alt="" class="icon rightTop" />
    <img :src="leftBottom" alt="" class="icon leftBottom" />
    <img :src="rightBottom" alt="" class="icon rightBottom" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// 导入图片
import rightTop from '@/assets/images/icon/right_top.png'
import rightBottom from '@/assets/images/icon/right_bottom.png'
import leftTop from '@/assets/images/icon/left_top.png'
import leftBottom from '@/assets/images/icon/left_bottom.png'
// 导入类型
import type { IProps } from './types.ts'

const props = withDefaults(defineProps<IProps>(), {
  bgColor: 'rgba(0, 0, 0, 0.2)',
  title: ''
})
const { bgColor, title } = toRefs(props)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
