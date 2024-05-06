<template>
  <div class="s-tag" :id="tagId" style="display: none">{{ name }}</div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
// 导入类型
import type { IProps } from './types'

const props = withDefaults(defineProps<IProps>(), {
  name: ''
})
const { name } = toRefs(props)

const tagId = computed(() => {
  return `${name.value}_tag`
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
