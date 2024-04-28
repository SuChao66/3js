<template>
  <div class="controls">
    <img
      v-for="(img, index) in images"
      :key="index"
      :src="img.url"
      :id="img.id"
      alt=""
      @click="handleImageClick(img.id)"
    />
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
// 导入图片
import black from '@/assets/images/幻夜黑.png'
import red from '@/assets/images/珊瑚红.png'
import blue from '@/assets/images/极光蓝.png'
import purple from '@/assets/images/极光紫.png'
// 导入类型
import type { IProps } from './types.ts'

const props = withDefaults(defineProps<IProps>(), {
  mesh: null
})
const { mesh } = toRefs(props)

const images = [
  {
    id: '幻夜黑',
    url: black
  },
  {
    id: '珊瑚红',
    url: red
  },
  {
    id: '极光蓝',
    url: blue
  },
  {
    id: '极光紫',
    url: purple
  }
]

const handleImageClick = (id: string) => {
  // 1.创建纹理贴图加载器
  const textureLoader = new THREE.TextureLoader()
  // 2.加载纹理
  const texture = textureLoader.load(`./texture/${id}.png`)
  texture.flipY = false
  // 3.设置模型材质颜色贴图
  mesh.value.material.map = texture
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
