<template>
  <div class="s-controls">
    <!-- 漫游 -->
    <el-button round plain size="large" @click="handleDamping">
      <template v-if="isDamping">
        <svg-icon icon-class="wholeScene"></svg-icon>
      </template>
      <template v-else>
        <svg-icon icon-class="damping"></svg-icon>
      </template>
      <span class="text">{{ isDamping ? '全景' : '漫游' }}</span>
    </el-button>
    <!-- 夜晚发光 -->
    <!-- <el-button round plain size="large" @click="handleDark">
      <template v-if="isDark">
        <svg-icon icon-class="sunLight"></svg-icon>
      </template>
      <template v-else>
        <svg-icon icon-class="moonLight"></svg-icon>
      </template>
      <span class="text">{{ isDark ? '白天' : '黑夜' }}</span>
    </el-button> -->
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
// 导入类型
import type { IProps } from './types'

// 0.定义props和emits
const emits = defineEmits(['handleDamping', 'handleDark'])
const props = withDefaults(defineProps<IProps>(), {
  isDamping: false,
  isDark: false
})
const { isDamping } = toRefs(props)

// 开始漫游
const handleDamping = () => {
  emits('handleDamping')
}

// 白天/黑夜
// const handleDark = () => {
//   emits('handleDark')
// }
</script>

<style lang="less" scoped>
@import './index.less';
</style>
