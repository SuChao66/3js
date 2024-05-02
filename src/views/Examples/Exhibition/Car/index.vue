<template>
  <div class="mobile">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- 颜色款式选择 -->
    <SColorChoose v-if="!isLoading" @handleColor="handleColor" />
    <!-- 控制 -->
    <SControls
      v-if="!isLoading"
      :isChangeColor="isChangeColor"
      :isRotate="isRotate"
      :isPlayBackgroundVoice="isPlayBackgroundVoice"
      :isOpenLight="isOpenLight"
      @handleRotate="handleRotate"
      @handleChangeColor="handleChangeColor"
      @handleMusic="handleMusic"
      @handleCarLight="handleCarLight"
    />
    <!-- canvas画布 -->
    <canvas id="webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入GLTF加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入draco解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入动画
import * as TWEEN from '@tweenjs/tween.js'
// 导入hooks
import { useWindowSize, useStatusByEnv } from '@/hooks'
import {
  useThree,
  useGround,
  useCarMaterial,
  useRoof,
  useCarDoorTag,
  useOpenDoor,
  useCarColorTween,
  useCarColor,
  useBgMusic,
  useCarLight
} from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import SColorChoose from './components/SColorChoose/index.vue'
import SControls from './components/SControls/index.vue'
// 导入常量
import { carColors } from './constants.ts'

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
// 是否正在变色
const isChangeColor = ref<boolean>(false)
// 是否正在旋转
const isRotate = ref<boolean>(false)
// 是否播放背景音乐
const isPlayBackgroundVoice = ref<boolean>(false)
// 车辆颜色变化动画
const colorTween = ref<any>(null)
// 背景音乐播放器
let backgroundAudio: any = null
// 是否打开车灯
const isOpenLight = ref<boolean>(false)
let openLight: any, closeLight: any

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  model: THREE.Group, // 模型集合
  status: Status, // 性能监视器
  textureCube: THREE.Texture

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    textureCube: mTextureCube
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  textureCube = mTextureCube
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
}

// 加载模型
const initModel = () => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load(
    './models/轿车.glb',
    (gltf) => {
      model = new THREE.Group()
      model.add(gltf.scene)
      // 1.将模型添加至场景中
      scene.add(model)
      // 2.创建地面
      useGround(scene)
      // 3.设置汽车的材质
      useCarMaterial(gltf.scene)
      // 4.创建隧道
      useRoof(scene)
      // 5.创建车门标签
      useCarDoorTag(gltf.scene)
      // 6.标签射线拾取
      useOpenDoor(gltf.scene, renderer, camera)
      // 7.创建车辆颜色变化动画
      colorTween.value = useCarColorTween(model)
      // 8.创建背景音乐
      backgroundAudio = useBgMusic()
      // 9.创建镜头光晕效果
      const { lensflare1, lensflare2, openCarLight, closeCarLight } =
        useCarLight(scene, textureCube)
      const light1 = gltf.scene.getObjectByName('镜头光晕1')
      const light2 = gltf.scene.getObjectByName('镜头光晕2')
      light1?.add(lensflare1)
      light2?.add(lensflare2)
      openLight = openCarLight
      closeLight = closeCarLight
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        isLoading.value = false
      }
    }
  )
}

// 手动颜色切换
const handleColor = (key: number) => {
  const color = carColors[key]
  useCarColor(model, color)
}

// 控制车辆旋转
const handleRotate = () => {
  isRotate.value = !isRotate.value
}

// 车辆颜色自动变化
const handleChangeColor = () => {
  if (isChangeColor.value) {
    colorTween.value.stop()
    // 动画停止，颜色回到最初的状态
    useCarColor(model, carColors[0])
  } else {
    colorTween.value.start()
  }
  isChangeColor.value = !isChangeColor.value
}

// 播放背景音乐
const handleMusic = () => {
  if (isPlayBackgroundVoice.value) {
    backgroundAudio.pause()
  } else {
    backgroundAudio.play()
  }
  isPlayBackgroundVoice.value = !isPlayBackgroundVoice.value
}

// 打开车灯
const handleCarLight = () => {
  if (isOpenLight.value) {
    closeLight()
  } else {
    openLight()
  }
  isOpenLight.value = !isOpenLight.value
}

// 渲染
const animate = () => {
  // 更新动画
  TWEEN.update()
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 模型旋转
  if (isRotate.value && model) {
    model.rotateY(0.001)
  }
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
  // 停止播放音乐
  backgroundAudio && backgroundAudio.pause()
  backgroundAudio = null
  // 停止变色
  colorTween.value && colorTween.value.stop()
  colorTween.value = null
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
