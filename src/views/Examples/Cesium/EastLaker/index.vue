<template>
  <div class="east-laker">
    <div class="cesium-container" ref="cesiumContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// 导入cesium
import * as Cesium from 'cesium'
// 导入Cesium样式
import 'cesium/Build/Cesium/Widgets/widgets.css'
// 导入hook
import { useCesiumBaseUrl } from '@/hooks'
import {
  useViewer,
  useMousePoition,
  useNavigation,
  useModifyMap,
  useModifyBuild
} from './hook'
// 导入store
import { useStore } from '@/store'

// 设置CESIUM_BASE_URL
const cesiumBaseUrl = useCesiumBaseUrl()
;(window as any).cesiumBaseUrl = cesiumBaseUrl
// 设置Cesium的token
const { global } = useStore()
Cesium.Ion.defaultAccessToken = global.defaultAccessToken

// cesium渲染DOM容器
const cesiumContainer = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // 1.初始化查看器
  const viewer = useViewer(cesiumContainer.value)
  // 2.根据鼠标位置，设置经纬度值
  useMousePoition(viewer, cesiumContainer.value)
  // 3.初始化导航罗盘
  useNavigation(viewer)
  // 4.修改地图影像图层的颜色
  useModifyMap(viewer)
  // 5.加载建筑物，并修改建筑物的颜色
  useModifyBuild(viewer)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
