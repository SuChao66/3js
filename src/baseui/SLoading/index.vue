<template>
  <div class="loading">
    <el-progress
      :percentage="currentProgress"
      :stroke-width="10"
      striped
      striped-flow
      :duration="10"
    >
      <el-button text class="text">{{ currentProgress }}%</el-button>
    </el-progress>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import type { IProps } from './types'

const props = withDefaults(defineProps<IProps>(), {
  currentProgress: 0
})
const { currentProgress } = toRefs(props)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
