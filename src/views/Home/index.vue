<template>
  <div class="home">
    <el-container>
      <Header />
      <el-main>
        <!-- 轮播图 -->
        <Swiper />
        <!-- threejs案例 -->
        <STitle title="数字孪生" />
        <div class="example-list" v-if="isRender">
          <SCard
            v-for="item in exmaples.digitalTwinsExamples"
            :key="item.key"
            :card="item"
            :column="column"
          />
        </div>
        <!-- <STitle title="元宇宙" />
        <div class="example-list" v-if="isRender">
          <SCard
            v-for="item in exmaples.metaverseExamples"
            :key="item.key"
            :card="item"
            :column="column"
          />
        </div>
        <STitle title="3D可视化大屏" />
        <STitle title="3D全景可视化" /> -->
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
// 导入组件
import Header from '@/components/Header/index.vue'
import Swiper from '@/components/Swiper/index.vue'
import STitle from '@/baseui/STitle/index.vue'
import SCard from '@/baseui/SCard/index.vue'
// 导入hook
import { useWindowSize } from '@/hooks'
// 导入store
import { useStore } from '@/store'

const { exmaples } = useStore()
const { width } = useWindowSize()
// 是否渲染作品card
const isRender = ref<boolean>(true)
// 每行展示几个作品
const column = ref(5)

watch(
  () => width,
  (val) => {
    isRender.value = false
    if (val.value < 400) {
      column.value = 1
    } else if (val.value < 700) {
      column.value = 2
    } else if (val.value < 1000) {
      column.value = 3
    } else {
      column.value = 4
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
