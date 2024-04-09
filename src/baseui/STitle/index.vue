<template>
  <div
    class="title"
    :style="{ fontSize: size + 'px', fontWeight: weight, color: color }"
  >
    {{ title }}
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

// 定义props
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '默认标题'
  },
  // 大小
  size: {
    type: Number,
    default: 20
  },
  // 颜色
  color: {
    type: String,
    default: '#333'
  },
  // 字重
  weight: {
    type: Number,
    default: 500
  }
})
const { title, size, color, weight } = toRefs(props)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
