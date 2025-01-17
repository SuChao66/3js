<template>
  <div class="smart-city">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- canvas画布 -->
    <canvas id="webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入hooks
import { useWindowSize, useStatusByEnv } from '@/hooks'
import {
  useThree,
  useBeiJing,
  useSubWay,
  useBusWay,
  useBuildMaterial
} from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  status: Status, // 性能监视器
  controls: OrbitControls,
  model: THREE.Group // 北京网格模型

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    controls: mControls
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  controls = mControls
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
}

// 加载模型
const initModel = async () => {
  model = new THREE.Group()
  scene.add(model)

  // 1.渲染北京城
  const beijing = (await useBeiJing({
    path: './data/城市建筑数据/GeoJSON数据/北京/北京城.json'
  })) as any
  model.add(beijing)
  // 修改材质
  useBuildMaterial({
    build: beijing,
    isCircle: true
  })
  // 可视化地铁流线
  initSubWayLine()
  // 可视化公交路线
  initBusWayLine()

  // 关闭loading
  isLoading.value = false
}

// 可视化地铁流线
const initSubWayLine = async () => {
  const line = (await useSubWay({
    path: './data/GeoJSON数据/北京地铁.json'
  })) as any
  model.add(line)
}

// 可视化公交流线
const initBusWayLine = async () => {
  const line = (await useBusWay({
    path: './data/GeoJSON数据/北京公交轨迹.json'
  })) as any
  model.add(line)
}

// 渲染
const animate = () => {
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机控件
  controls && controls.update()
}

// 监听窗口的变化
const handleResize = (width: number, height: number) => {
  // 计算相机的aspect
  const aspect = width / height
  if (camera) {
    camera.aspect = aspect
    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
  }
  // 重新设置输出画布大小
  if (renderer) {
    renderer.setSize(width, height)
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
