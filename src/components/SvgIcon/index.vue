<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
// 定义props
const props = defineProps({
  iconClass: {
    // 图标名称与assets/icon/svg下使用的文件名一致
    type: String,
    required: true
  },
  className: {
    // 给图标添加class
    type: String,
    default: ''
  },
  color: {
    // 设置图标颜色
    type: String,
    default: '#333'
  },
  size: {
    // 设置图标大小
    type: Number,
    default: 20
  }
})
const iconName = computed(() => {
  return `#icon-${props.iconClass}`
})
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`
  }
  return 'svg-icon'
})
</script>

<style scoped lang="less"></style>
