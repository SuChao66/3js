<template>
  <div class="mobile">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- gui控制器 -->
    <div ref="guiRef"></div>
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
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入GLTF加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入draco解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入hooks
import { useWindowSize, useStatusByEnv, useTexture, useLog2xyz } from '@/hooks'
import { useThree, useEarth, useSphere } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
// 导入常量
import { earthRadius, s } from './constants'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// GUI控制器
const guiRef = ref<HTMLDivElement | null>(null)
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
  controls: OrbitControls, // 相机控制器
  earth: THREE.Mesh, // 地球网格模型
  gui: any // GUI控制器

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    controls: mControls,
    status: mStatus,
    gui: mGUI
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  controls = mControls
  renderer = mRenderer
  gui = mGUI
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加gui控制器
  guiRef.value.appendChild(gui.domElement)
}

// 加载模型
const initModel = () => {
  // 1.创建地球
  earth = useEarth()
  // 2.添加至场景中
  scene.add(earth)
  // 3.结束loading
  isLoading.value = false
  // 4.郑州
  // const { x, y, z } = useLog2xyz(earthRadius, 113.5, 34.5)
  // const sphere = useSphere({ R: 5, position: new THREE.Vector3(x, y, z) })
  // scene.add(sphere)
}

// 初始化GUI控制器
const initGui = () => {
  const obj = {
    isShow: false
  }
  gui
    .add(obj, 'isShow')
    .name('是否显示经纬度')
    .onChange((value) => {
      const textureLatitude = useTexture({
        path: './images/earth/earthLatitude.jpg'
      })
      const texture = useTexture({ path: './images/earth/earth.jpg' })
      earth.material.map = value ? textureLatitude : texture
    })
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  // 时间差
  const delta = clock.getDelta()
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
  // 初始化gui
  initGui()
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
})
</script>

<style lang="less" scoped></style>
