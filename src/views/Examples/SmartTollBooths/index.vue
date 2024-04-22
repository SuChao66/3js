<template>
  <div class="smart-toll-booths">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <canvas id="webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入GLTF加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入draco解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入动画库
// import * as TWEEN from '@tweenjs/tween.js'
// 导入hooks
import { useWindowSize, useStatusByEnv } from '@/hooks'
import { useThree } from './hook/useThree.ts'
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
  model: THREE.Group = new THREE.Group(), // 模型集合
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  status: Status, // 性能监视器
  controls: OrbitControls, // 相机控制器
  cameraPos: THREE.Vector3, // 相机初始位置
  controlsTarget: THREE.Vector3 // 相机初始target

const { initThree } = useThree()

// 加载模型
const initModel = () => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load(
    './models/收费站.glb',
    (gltf) => {
      console.log(gltf.scene)
      model.add(gltf.scene)
      scene.add(model)
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        setTimeout(() => {
          isLoading.value = false
        }, 1000)
      }
    }
  )
}

// 渲染
// const clock = new THREE.Clock()
const animate = () => {
  // 获取上下两针时间间隔
  // const delta = clock.getDelta()
  // 渲染器渲染
  renderer && renderer.render(scene!, camera)
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

onMounted(() => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    controls: mControls,
    status: mStatus,
    cameraPos: mCameraPos,
    controlsTarget: mControlsTarget
  } = initThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  controls = mControls
  renderer = mRenderer
  cameraPos = mCameraPos
  controlsTarget = mControlsTarget
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
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
