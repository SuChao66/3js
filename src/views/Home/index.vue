<template>
  <div>{{ global.title }}</div>
  <el-button type="primary" @click="increment">+1</el-button>
  当前计数：{{ counter.count }}
</template>

<script lang="ts" setup>
import { useStore } from '@/store'

const { global, counter } = useStore()

const increment = () => {
  counter.increment()
}

const count = ref(0)
console.log(count)
</script>

<style lang="less" scoped></style>
