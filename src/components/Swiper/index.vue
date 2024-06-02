<template>
  <div class="swiper-container">
    <el-carousel :height="height">
      <el-carousel-item v-for="item in images" :key="item">
        <el-image
          style="width: 100%; height: 100%"
          :src="item.url"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          fit="cover"
          @click="handleImgClick(item.path)"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup lang="ts">
import smartFactory from '@/assets/images/swiper/smart-factory.png'
import smartTollBooths from '@/assets/images/swiper/smart-toll-booths.png'
import earthBigScreen from '@/assets/images/swiper/3d-earth.png'
// 导入类型
import type { IProps } from './types'
// 导入路由
import { useRouter } from 'vue-router'

const router = useRouter()

// 0.定义props
const props = withDefaults(defineProps<IProps>(), {
  height: '500px'
})
const { height } = toRefs(props)

const images = [
  {
    url: earthBigScreen,
    path: '3dEarth'
  },
  {
    url: smartFactory,
    path: 'SmartFactory'
  },
  {
    url: smartTollBooths,
    path: 'SmartTollBooths'
  }
]

const handleImgClick = (path: string) => {
  router.push({
    name: path
  })
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
