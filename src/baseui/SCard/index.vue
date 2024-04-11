<template>
  <div
    class="card"
    :style="cardStyle(card.key)"
    @click="handleClick(card.path)"
  >
    <img :src="card.img" class="cover-bg" />
    <div class="title">{{ card.title }}</div>
    <div class="desc">{{ card.desc }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
// 导入类型
import type { IProps } from './types'
// 导入路由
import { useRouter } from 'vue-router'

const router = useRouter()
const props = withDefaults(defineProps<IProps>(), {
  card: () => ({
    key: 0,
    title: '',
    img: '',
    desc: '',
    path: ''
  }),
  column: 5,
  margin: () => [0, 20, 20, 0]
})
const { card, column, margin } = toRefs(props)

const cardStyle = computed(() => {
  return (index: number) => {
    const w = '100%'
    const offset = margin.value[1]
    const width = `calc((${w} - ${offset * (column.value - 1)}px) / ${column.value})`

    return {
      width: width,
      marginTop: `${margin.value[0]}`,
      marginRight: index % column.value === 0 ? '0px' : `${offset}px`,
      marginBottom: `${margin.value[2]}px`,
      marginLeft: `${margin.value[3]}px`
    }
  }
})

// 点击跳转
const handleClick = (path: string) => {
  router.push({
    name: path
  })
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
