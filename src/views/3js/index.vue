<template>
  <div class="3js">
    <el-container>
      <el-main>
        <!-- 数字孪生 -->
        <DigitalTwins :column="column" :isRender="isRender" />
        <!-- 3D数据可视化 -->
        <Visualization :column="column" :isRender="isRender" />
        <!-- 3D展览 -->
        <Exhibition :column="column" :isRender="isRender" />
        <!-- shader鉴赏 -->
        <Shaders :column="column" :isRender="isRender" />
        <!-- 元宇宙 -->
        <!-- <Mataverse :column="column" :isRender="isRender" /> -->
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
// 导入组件
import Header from '@/components/Header/index.vue'
// import Banner from '@/components/Banner/index.vue'
// import Swiper from '@/components/Swiper/index.vue'
import VideoBg from '@/components/VideoBg/index.vue'
import DigitalTwins from './modules/DigitalTwins/index.vue'
// import Mataverse from './modules/Mataverse/index.vue'
import Exhibition from './modules/Exhibition/index.vue'
import Visualization from './modules/Visualization/index.vue'
import Shaders from './modules/Shaders/index.vue'
// 导入hook
import { useWindowSize } from '@/hooks'

const { width } = useWindowSize()
// 是否渲染作品card
const isRender = ref<boolean>(true)
// 每行展示几个作品
const column = ref(4)
// 是否展示顶部右侧内容
const isShowRight = ref<boolean>(true)

watch(
  () => width,
  (val) => {
    isRender.value = false
    if (val.value < 400) {
      column.value = 1
    } else if (val.value < 700) {
      column.value = 2
      isShowRight.value = false
    } else if (val.value < 1000) {
      column.value = 3
      isShowRight.value = true
    } else {
      column.value = 4
      isShowRight.value = true
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
