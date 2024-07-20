<template>
  <div class="smart-parks">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- 控制按钮 -->
    <SControl v-if="!isLoading" @handleBtnClick="handleBtnClick" />
    <!-- 标签 -->
    <div style="display: none">
      <STag :tagsArr="tagsArr" />
    </div>
    <!-- 标签渲染 -->
    <div ref="tagRef"></div>
    <!-- canvas画布 -->
    <canvas id="webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入gltfloader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入dracoloader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  useProgress,
  useCSS3DObject
} from '@/hooks'
import { useThree, useEvent } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import STag from './components/STag/index.vue'
import SControl from './components/SControl/index.vue'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 标签渲染
const tagRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)
// 第二层标签
const tagsArr = [
  {
    name: '小型会议室',
    temperature: 24,
    humidity: '50%'
  },
  {
    name: '核心科技室',
    temperature: 28,
    humidity: '10%'
  },
  {
    name: '科技展台',
    temperature: 20,
    humidity: '30%'
  },
  {
    name: '设计总监办公室',
    temperature: 26,
    humidity: '25%'
  }
]
// 标签数组
const labels: CSS3DObject[] = []

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  css3Renderer: CSS3DRenderer, // 3d渲染器
  status: Status, // 性能监视器
  controls: OrbitControls,
  wall: any, // 外墙
  floor1: any, // 第一层楼
  floor2: any, // 第二层楼
  fighter: any, // 战斗机
  model: THREE.Group // 网格模型

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    controls: mControls,
    css3Renderer: mCss3Renderer
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  controls = mControls
  css3Renderer = mCss3Renderer
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加css3DRenderer
  tagRef.value?.appendChild(css3Renderer.domElement)
}

// 加载模型
const initModel = async () => {
  model = new THREE.Group()
  scene.add(model)

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/gltf/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  // 加载第一层模型
  loader.load('./models/parks/floor1.glb', (gltf) => {
    floor1 = gltf.scene
    model.add(floor1)
  })
  // 加载第二层模型
  loader.load('./models/parks/floor2.glb', (gltf) => {
    floor2 = gltf.scene
    floor2.traverse((child: any) => {
      // 添加标签
      tagsArr.forEach((tag, index) => {
        if (tag.name.indexOf(child.name) !== -1) {
          const label = createTag(child, index)
          label.visible = false
          labels.push(label)
          floor2.add(label)
        }
      })
    })
    model.add(floor2)
    // 加载战斗机
    loader.load('./models/parks/Fighter.glb', (gltf) => {
      fighter = gltf.scene
      fighter.visible = false
      fighter.position.set(4, 40, 68)
      fighter.traverse((child: any) => {
        if (child.isMesh) {
          // 新增position2，保留原有position
          child.position2 = child.position.clone()
        }
      })
      floor2.add(fighter)
    })
  })
  // 加载外墙模型
  loader.load('./models/parks/wall.glb', (gltf) => {
    wall = gltf.scene
    model.add(wall)
  })
}

// 创建标签
const createTag = (child: any, index: number) => {
  // 获取dom
  const dom = document.getElementById(`tag${index}`) as HTMLDivElement
  const label = useCSS3DObject({
    dom: dom,
    position: child.position,
    scale: new THREE.Vector3(0.2, 0.2, 0.2)
  })
  return label
}

const handleBtnClick = (key: string) => {
  const { initEvent } = useEvent({
    floor1,
    floor2,
    wall,
    fighter,
    labels,
    model
  })
  const {
    handleShowWall,
    handleShowAll,
    handleHideAll,
    handleShowFloor1,
    handleShowFloor2,
    handleFlatFighter,
    handleRecoverFighter,
    handlePointsFighter,
    handlePointsBlast,
    handlePointsBack
  } = initEvent()
  switch (key) {
    // 厂房外形展示
    case 'showWall':
      handleShowWall()
      break
    // 厂房分层展开
    case 'showAll':
      handleShowAll()
      break
    // 关闭分层展开
    case 'hideAll':
      handleHideAll()
      break
    // 展示第一层楼
    case 'showFloor1':
      handleShowFloor1()
      break
    // 展示第二层楼
    case 'showFloor2':
      handleShowFloor2()
      break
    // 展开飞机
    case 'flatFighter':
      handleFlatFighter()
      break
    // 恢复飞机
    case 'recoverFighter':
      handleRecoverFighter()
      break
    // 飞机粒子
    case 'pointsFighter':
      handlePointsFighter()
      break
    // 粒子爆炸
    case 'pointsBlast':
      handlePointsBlast()
      break
    // 粒子复原
    case 'pointsBack':
      handlePointsBack()
  }
}

// 渲染
const animate = () => {
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // 3d熏染器
  css3Renderer && css3Renderer.render(scene, camera)
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
  // 重新设置css3d渲染器大小
  if (css3Renderer) {
    css3Renderer.setSize(width, height)
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
