<template>
  <div
    class="elementTag"
    :id="'tag' + index"
    v-for="(tag, index) in tagsArr"
    :key="index"
  >
    <div class="elementContent">
      <h4>{{ tag.name }}</h4>
      <p>温度：{{ tag.temperature }}℃</p>
      <p>湿度：{{ tag.humidity }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入类型
import type { IProps } from './types'

const props = withDefaults(defineProps<IProps>(), {
  tagsArr: () => []
})
const { tagsArr } = toRefs(props)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
