<template>
  <div class="map">
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
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  useEarthCountry,
  useArcFlyPath,
  useLon2xyz
} from '@/hooks'
import { useThree } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
// 导入常量
import { s } from './constants'
import { earthRadius } from '../Earth/constants'
// 导入数据
import data from './data/data.js'

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
// 飞线段数组
let flyLineArr: any[] = []

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.OrthographicCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  model: THREE.Group, // 模型集合
  status: Status, // 性能监视器
  controls: OrbitControls // 相机控制器

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    controls: mControls,
    status: mStatus
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  controls = mControls
  renderer = mRenderer
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
}

// 加载模型
const initModel = async () => {
  // 0. 初始化model
  model = new THREE.Group()
  scene.add(model)
  // 1.创建地球
  const earth = (await useEarthCountry({
    R: earthRadius,
    path: './data/world.json'
    // opacity: 0.3,
    // transparent: true
  })) as any
  model.add(earth)
  // 2.绘制飞线
  const flyPathGroup = new THREE.Group()
  const start = data.start
  const { x, y, z } = useLon2xyz(earthRadius, start.E, start.N)
  const startPoint = new THREE.Vector3(x, y, z)
  data.endArr.forEach((cood: any) => {
    const { x, y, z } = useLon2xyz(earthRadius, cood.E, cood.N)
    const endPoint = new THREE.Vector3(x, y, z)
    const { line } = useArcFlyPath({
      R: earthRadius,
      startPoint,
      endPoint,
      model
    })
    flyPathGroup.add(line)
    flyLineArr.push(line.flyLine)
  })
  model.add(flyPathGroup)

  // 关闭loading
  isLoading.value = false
}

// 渲染
const animate = () => {
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 动态更新飞线的角度
  flyLineArr.forEach((flyLine) => {
    flyLine.rotation.z += 0.02
    if (flyLine.rotation.z >= flyLine.flyEndAngle) {
      flyLine.rotation.z = flyLine.startAngle
    }
  })
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
