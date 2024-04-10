<template>
  <div class="swiper-container">
    <el-carousel :height="height">
      <el-carousel-item v-for="item in images" :key="item">
        <el-image
          style="width: 100%; height: 100%"
          :src="item"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          fit="cover"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import room from '@/assets/images/room.jpeg'
import bigScreen from '@/assets/images/big-screen.jpeg'
import human from '@/assets/images/3d-human.png'
import internetOfThings from '@/assets/images/3d-lianwang.jpeg'
import mall from '@/assets/images/3d-mall.jpg'
import park from '@/assets/images/3d-park.png'
// 导入类型
import type { IProps } from './types'

// 0.定义props
const props = withDefaults(defineProps<IProps>(), {
  height: '450px'
})
const { height } = toRefs(props)

const images = [room, bigScreen, human, internetOfThings, mall, park]
</script>

<style lang="less" scoped>
@import './index.less';
</style>
