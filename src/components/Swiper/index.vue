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
import merry_card from '@/assets/images/merry_card.png'
import robot from '@/assets/images/robot.png'
import earthMoon from '@/assets/images/earth_moon.png'
import happy_new_year from '@/assets/images/happy_new_year.png'
import island from '@/assets/images/island.png'
import smart_factory from '@/assets/images/smart_factory.png'
import vr_room from '@/assets/images/vr_room.png'

// 0.定义props
const props = defineProps({
  height: {
    type: String,
    default: '400px'
  }
})

const images = [
  vr_room,
  merry_card,
  robot,
  island,
  smart_factory,
  earthMoon,
  happy_new_year
]
</script>

<style lang="less" scoped>
@import './index.less';
</style>
