<template>
  <div class="home">
    <el-container>
      <Header />
      <el-main>
        <!-- 轮播图 -->
        <Swiper />
        <!-- threejs案例 -->
        <STitle title="精选案例" />
        <div class="example-list">
          <SCard v-for="item in exampleList" :key="item.key" :card="item" />
        </div>
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
import type { ICard } from '@/type'

const exampleList = reactive<ICard[]>([
  {
    key: 1,
    title: '元宇宙'
  },
  {
    key: 2,
    title: '元宇宙'
  },
  {
    key: 3,
    title: '元宇宙'
  },
  {
    key: 4,
    title: '元宇宙'
  },
  {
    key: 5,
    title: '元宇宙'
  }
])
</script>

<style lang="less" scoped>
@import './index.less';
</style>
