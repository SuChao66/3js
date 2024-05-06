<template>
  <div class="mobile">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 楼栋标签 -->
    <STag v-for="(tag, index) in buildingsTags" :key="index" :name="tag" />
    <!-- 楼栋 -->
    <div ref="buildingsTagRef"></div>
    <!-- 控制器 -->
    <SControl
      v-if="!isLoading"
      :isDamping="isDamping"
      @handleDamping="handleDamping"
    />
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
// 导入GLTF加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入draco解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入CSS2DRenderer
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
// 导入hooks
import { useWindowSize, useStatusByEnv } from '@/hooks'
import { useThree, useCommunityMaterial, useBuildingsTag } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import STag from './components/STag/index.vue'
import SControl from './components/SControl/index.vue'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 楼栋渲染器
const buildingsTagRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)
// 水池纹理
let waterMap: THREE.Texture | null = null
// 楼栋标签数组
const buildingsTags = ref<string[]>([])
// 是否开启漫游
const isDamping = ref<boolean>(false)

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  css2DRenderer: CSS2DRenderer, // css2渲染器
  model: THREE.Group, // 模型集合
  status: Status // 性能监视器

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    css2DRenderer: mCss2DRenderer
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  css2DRenderer = mCss2DRenderer
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加css2DRenderer
  buildingsTagRef.value?.appendChild(css2DRenderer.domElement)
}

// 加载模型
const initModel = () => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load(
    './models/小区2.glb',
    (gltf) => {
      model = new THREE.Group()
      model.add(gltf.scene)
      // 1.将模型添加至场景中
      scene.add(model)
      // 2.对模型进行处理，接受光照阴影
      const { map } = useCommunityMaterial(gltf.scene)
      waterMap = map
      // 3.创建楼栋标签
      useBuildingsTag(buildingsTags.value, gltf.scene)
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        isLoading.value = false
      }
    }
  )
}

// 初始化楼栋标签数据
const initBuildingTags = () => {
  const tags = []
  tags.push('物业', '西大门', '东大门')
  for (let i = 1; i < 30; i++) {
    let name = '' + i
    if (i < 10) name = '0' + name
    tags.push(name)
  }
  buildingsTags.value = tags
}

// 宇宙漫游
const handleDamping = () => {
  isDamping.value = !isDamping.value
  if (isDamping.value) {
    console.log('漫游')
  } else {
    console.log('全景')
  }
}

// 渲染
const animate = () => {
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // css2D渲染器
  css2DRenderer && css2DRenderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新水池纹理的偏移量
  if (waterMap) {
    waterMap.offset.x += 0.002
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
  // 重新设置css2DLabel输出画布大小
  if (css2DRenderer) {
    css2DRenderer.setSize(width, height)
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
  // 初始化楼栋标签数据
  initBuildingTags()
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
})
</script>

<style lang="less" scoped></style>
