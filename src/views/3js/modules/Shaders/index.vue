<template>
  <STitle title="shader鉴赏" />
  <template v-if="exmaples.shadersExamples.length > 0">
    <div class="example-list" v-if="isRender">
      <SCard
        v-for="item in exmaples.shadersExamples"
        :key="item.key"
        :card="item"
        :column="column"
      />
    </div>
  </template>
  <template v-else>
    <SNotFound />
  </template>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
// 导入组件
import STitle from '@/baseui/STitle/index.vue'
import SCard from '@/baseui/SCard/index.vue'
import SNotFound from '@/baseui/SNotFound/index.vue'
// 导入store
import { useStore } from '@/store'
// 导入类型
import type { IProps } from './types'

const props = withDefaults(defineProps<IProps>(), {
  column: 5,
  isRender: false
})
const { column, isRender } = toRefs(props)

const { exmaples } = useStore()
</script>

<style lang="less" scoped></style>
