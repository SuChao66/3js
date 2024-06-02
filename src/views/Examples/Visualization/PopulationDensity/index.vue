<template>
  <div class="earth">
    <!-- 顶部标题 -->
    <SBigScreenHeader title="全球人口密度可视化" />
    <!-- 图表 -->
    <SCharts v-if="!isLoading" />
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- css2D标签渲染器 -->
    <div ref="css2DRendererRef"></div>
    <!-- canvas画布 -->
    <canvas id="webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// CSS2DRenderer
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
// 导入TWEEN
import * as TWEEN from '@tweenjs/tween.js'
// 导入hooks
import { useWindowSize, useStatusByEnv, useEarthCountry } from '@/hooks'
import { useThree, useEarthCircle, usePopulationDensity } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import SBigScreenHeader from '@/baseui/SBigScreenHeader/index.vue'
import SCharts from './components/SCharts/index.vue'
// 导入常量
import { s, earthRadius } from './constants'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// css2Drenderer渲染器
const css2DRendererRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.OrthographicCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  css2Renderer: CSS2DRenderer, // css2D标签渲染器
  status: Status, // 性能监视器
  model: THREE.Group, // 地球网格模型
  earth: any // 地球模型

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    css2Renderer: mCss2Renderer
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  css2Renderer = mCss2Renderer
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加css2Drender
  css2DRendererRef.value?.appendChild(css2Renderer.domElement)
}

// 加载模型
const initModel = async () => {
  // 1.创建地球
  model = new THREE.Group()
  scene.add(model)
  earth = await useEarthCountry({
    R: earthRadius,
    path: './data/worldZh.json',
    isZh: true
  })
  model.add(earth)
  // 2.创建地球光圈
  const sprite = useEarthCircle('./images/planets/glow.png')
  model.add(sprite)

  // 7.初始化人口密度
  const group = (await usePopulationDensity(
    './data/population_density.json'
  )) as any
  model.add(group)

  // 结束loading
  isLoading.value = false
}

// 渲染
const animate = () => {
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // css2D渲染器渲染
  css2Renderer && css2Renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新动画时间
  TWEEN.update()
  // 旋转地球
  model && model.rotateY(0.0015)
}

// 监听窗口的变化
const handleResize = (width: number, height: number) => {
  // 计算相机的aspect
  const k = width / height
  if (camera) {
    // 更新相机参数
    camera.left = -s * k
    camera.right = s * k
    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
  }
  // 重新设置输出画布大小
  if (renderer) {
    renderer.setSize(width, height)
  }
  // 重新设置css2DRenderer
  if (css2Renderer) {
    css2Renderer.setSize(width, height)
  }
}

watch(
  () => [width, height],
  ([newWidth, newHeight]) => {
    handleResize(newWidth.value, newHeight.value)
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  // 初始化
  init()
  // 加载模型
  initModel()
  // 播放动画
  animate()
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
