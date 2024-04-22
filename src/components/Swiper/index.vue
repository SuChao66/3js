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
import smartFactory from '@/assets/images/smart-factory.png'
// 导入类型
import type { IProps } from './types'
// 导入路由
import { useRouter } from 'vue-router'

const router = useRouter()

// 0.定义props
const props = withDefaults(defineProps<IProps>(), {
  height: '450px'
})
const { height } = toRefs(props)

const images = [
  {
    url: smartFactory,
    path: 'SmartFactory'
  },
  {
    url: smartFactory,
    path: 'SmartFactory'
  },
  {
    url: smartFactory,
    path: 'SmartFactory'
  },
  {
    url: smartFactory,
    path: 'SmartFactory'
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
