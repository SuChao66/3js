<template>
  <div class="3js">
    <el-container>
      <el-main>
        <!-- 元宇宙 -->
        <Mataverse :column="column" :isRender="isRender" />
        <!-- 数字孪生 -->
        <DigitalTwins :column="column" :isRender="isRender" />
        <!-- 3D数据可视化 -->
        <Visualization :column="column" :isRender="isRender" />
        <!-- 3D展览 -->
        <Exhibition :column="column" :isRender="isRender" />
        <!-- shader鉴赏 -->
        <Shaders :column="column" :isRender="isRender" />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
// 导入组件
import DigitalTwins from './modules/DigitalTwins/index.vue'
import Mataverse from './modules/Mataverse/index.vue'
import Exhibition from './modules/Exhibition/index.vue'
import Visualization from './modules/Visualization/index.vue'
import Shaders from './modules/Shaders/index.vue'
// 导入hook
import { useWindowSize } from '@/hooks'
// 导入store
import { useStore } from '@/store'

const { global } = useStore()
const { width } = useWindowSize()
// 是否渲染作品card
const isRender = ref<boolean>(true)
// 每行展示几个作品
const column = ref(4)

watch(
  () => width,
  (val) => {
    isRender.value = false
    if (val.value < 400) {
      column.value = 1
      global.SET_IS_SHOW_HEADER_RIGHT(false)
    } else if (val.value < 700) {
      column.value = 2
      global.SET_IS_SHOW_HEADER_RIGHT(false)
    } else if (val.value < 1000) {
      column.value = 3
      global.SET_IS_SHOW_HEADER_RIGHT(false)
    } else {
      column.value = 4
      global.SET_IS_SHOW_HEADER_RIGHT(true)
    }
    setTimeout(() => {
      isRender.value = true
    }, 0)
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
