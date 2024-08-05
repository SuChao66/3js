<template>
  <div class="tomb-raider">
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
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  useProgress
  // useGLTFModel
} from '@/hooks'
import { useThree } from './hook'
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
  model: THREE.Group // 网格模型

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
}

// 加载模型
const initModel = async () => {
  model = new THREE.Group()
  scene.add(model)

  // 1.加载场景模型
  initSceneModel()
}

// 加载场景模型
const initSceneModel = async () => {}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  const delta = clock.getDelta()
  console.log(delta)
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
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

onMounted(async () => {
  // 初始化
  init()
  // 加载模型
  initModel()
  // 播放动画
  animate()
  // 加载进度
  useProgress((progress: number) => {
    currentProgress.value = progress
    if (progress === 100) {
      isLoading.value = false
    }
  })
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
