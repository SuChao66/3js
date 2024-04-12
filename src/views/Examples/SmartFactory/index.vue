<template>
  <div class="smart-factory">
    <div class="btn-operation" v-if="!isLoading">
      <el-button size="large" plain round @click="handlePlay">
        {{ isPlaying ? '暂停' : '播放' }}
      </el-button>
      <el-button size="large" plain round @click="handleEnvironment('rain')">
        下雨
      </el-button>
      <el-button size="large" plain round @click="handleEnvironment('snow')">
        下雪
      </el-button>
    </div>
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
// 导入RGBELoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入hooks
import { useWindowSize } from '@/hooks'
import { useThree } from './hook/useThree.ts'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 动画是否在播放
const isPlaying = ref<boolean>(true)
// 精灵个数
const N = 8000
// 当前环境中的效果，下雨/下雪
let currentEnvironemnt: string = null
// 模型加载进度
const currentProgress = ref<number>(0)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// three变量
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  status: Status,
  controls: OrbitControls,
  mixer: THREE.AnimationMixer,
  clipAction: THREE.AnimationAction,
  spriteGroup: THREE.Group
let timer = null

const { initThree } = useThree()
onMounted(() => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    controls: mControls,
    status: mStatus
  } = initThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  controls = mControls
  renderer = mRenderer
  statusRef.value.appendChild(mStatus.dom)
  // 加载模型
  initModel()
  // 播放动画
  animate()
})

// 加载模型
const initModel = () => {
  const loader = new GLTFLoader()
  loader.load(
    './models/factory.glb',
    (gltf) => {
      scene.add(gltf.scene)
      // 播放关键帧动画
      mixer = new THREE.AnimationMixer(gltf.scene)
      // 获取gltf.animations[0]的第一个clip动画对象
      clipAction = mixer.clipAction(gltf.animations[0])
      // 播放动画
      clipAction.play()
      // 暂停状态
      clipAction.paused = true
      // 默认下雨效果
      handleEnvironment('rain')
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        setTimeout(() => {
          isLoading.value = false
        }, 3000)
      }
    }
  )
}

// 模拟场景中下雨或者下雪的效果
const initRainOrSnow = (texture) => {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture
  })
  spriteGroup = new THREE.Group()
  scene.add(spriteGroup)
  for (let i = 0; i < N; i++) {
    const sprite = new THREE.Sprite(spriteMaterial)
    spriteGroup.add(sprite)
    // 设置精灵模型位置，在长方体空间中随机分布
    const x = 1000 * (Math.random() - 0.5)
    const y = 600 * Math.random()
    const z = 1000 * (Math.random() - 0.5)
    sprite.position.set(x, y, z)
  }
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  // 获取上下两针时间间隔
  const delta = clock.getDelta()
  // 设置渲染器输出画布大小
  renderer && renderer.render(scene, camera)
  timer = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机控制器
  controls && controls.update()
  // 更新动画时间
  mixer && mixer.update(delta)
  // 更新雨滴的位置
  if (spriteGroup) {
    spriteGroup.children.forEach((sprite) => {
      // 雨滴或者雪的y坐标每次减t*60
      sprite.position.y -= 50 * delta
      // 如果是下雪，改变雪花的姿态
      if (currentEnvironemnt === 'snow') {
        sprite.rotateZ(Math.PI * delta * 50)
      }
      if (sprite.position.y < 0) {
        sprite.position.y = 600
      }
    })
  }
}

// 播放动画
const handlePlay = () => {
  if (clipAction && clipAction.paused) {
    // 暂停状态
    clipAction.paused = false
    isPlaying.value = true
  } else {
    clipAction.paused = true
    isPlaying.value = false
  }
}

// 模拟下雨/下雪效果
const handleEnvironment = (type: string) => {
  // 1.判断场景中是否有下雨或者下雪的效果
  if (spriteGroup) {
    spriteGroup.traverse((item) => {
      if (item.type === 'Sprite') {
        item.material.dispose()
      }
    })
    scene.remove(spriteGroup)
  }
  if (type === 'rain') {
    const texture = new THREE.TextureLoader().load('./images/sprite/rain.png')
    currentEnvironemnt = 'rain'
    initRainOrSnow(texture)
  } else {
    const texture = new THREE.TextureLoader().load('./images/sprite/snow.png')
    currentEnvironemnt = 'snow'
    initRainOrSnow(texture)
  }
}

// 监听窗口的变化
const handleResize = (width, height) => {
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

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  scene.traverse((item) => {
    if (item.isMesh) {
      item.geometry.dispose()
      item.material.dispose()
      if (item.texture) {
        item.texture.dispose()
      }
      scene.remove(item)
    }
  })
  scene = null
  cancelAnimationFrame(timer)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
