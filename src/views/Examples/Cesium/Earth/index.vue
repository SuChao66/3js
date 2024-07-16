<template>
  <div class="earth">
    <!-- DOM容器 -->
    <div class="cesium-container" ref="cesiumContainer"></div>
  </div>
</template>

<script setup lang="ts">
// 导入cesium
import * as Cesium from 'cesium'
// 导入Cesium样式
import 'cesium/Build/Cesium/Widgets/widgets.css'
// 导入hook
import { useCesiumBaseUrl } from '@/hooks'
// 导入store
import { useStore } from '@/store'

// 设置CESIUM_BASE_URL
const cesiumBaseUrl = useCesiumBaseUrl()
window.CESIUM_BASE_URL = cesiumBaseUrl
// 设置Cesium的token
const { global } = useStore()
Cesium.Ion.defaultAccessToken = global.defaultAccessToken

// cesium渲染DOM容器
const cesiumContainer = ref<HTMLDivElement | null>(null)

// 设置cesium的默认视角
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  // 西边的经度
  89.5,
  // 南边纬度
  20.4,
  // 东边的经度
  110.4,
  // 北边的纬度
  61.2
)

const init = () => {
  // 创建查看器
  const viewer = new Cesium.Viewer(cesiumContainer.value as HTMLElement, {
    // 是否显示信息窗口
    infoBox: false,
    // 是否显示右上角搜索框，可以搜索任何一个地方
    geocoder: false,
    // 是否显示右上角home按钮
    homeButton: false,
    // 是否显示右上角3D、2D、2.5D的切换（显示模式）
    sceneModePicker: false,
    // 是否显示右上角图层选择器
    baseLayerPicker: false,
    // 是否显示右上角帮助按钮
    navigationHelpButton: false,
    // 是否显示底下的动画播放按钮
    animation: false,
    // 是否显示底下的时间轴
    timeline: false,
    // 是否现实全屏按钮
    fullscreenButton: false
    // 设置天空盒子
    // skyBox: new Cesium.SkyBox({
    //   sources: {
    //     positiveX: '',
    //     negativeX: '',
    //     positiveY: '',
    //     negativeY: '',
    //     positiveZ: '',
    //     negativeZ: ''
    //   }
    // })
  })
  // 隐藏查看器底下的  logo
  ;(viewer.cesiumWidget.creditContainer as any).style.display = 'none'
}

onMounted(() => {
  init()
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
