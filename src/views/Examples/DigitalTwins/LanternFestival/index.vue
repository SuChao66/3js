<template>
  <div class="lantern-festival">
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
// 导入gltfloader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入dracoloader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// 导入water
import { Water } from 'three/examples/jsm/objects/Water2'
// 导入hooks
import { useWindowSize, useStatusByEnv, usePointer } from '@/hooks'
import { useThree, useFireWork } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
// 导入shader
import flylightVertexShader from './shaders/flylight/vertex.glsl'
import flylightFragmentShader from './shaders/flylight/fragment.glsl'
// 导入动画库
import gsap from 'gsap'

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
// 灯笼数量
const flyLightNum = 100
// 烟花数组
const fireworks: any[] = []

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  status: Status, // 性能监视器
  controls: OrbitControls,
  model: THREE.Group, // 网格模型
  lightBox: THREE.Mesh // 灯笼

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

  // 设置解压缩资源路径
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/gltf/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load(
    './models/newyears_draco.glb',
    (gltf) => {
      model.add(gltf.scene)
      // 创建水面效果
      createWater()
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        isLoading.value = false
      }
    }
  )

  // 加载灯笼
  initFlyLight()
}

// 创建灯笼
const initFlyLight = () => {
  const loader = new GLTFLoader()
  loader.load('./models/flyLight.glb', (gltf) => {
    lightBox = gltf.scene.children[0] as THREE.Mesh
    // 修改灯笼的材质
    const lightMaterial = new THREE.ShaderMaterial({
      vertexShader: flylightVertexShader,
      fragmentShader: flylightFragmentShader,
      side: THREE.DoubleSide
    })
    lightBox.material = lightMaterial
    // 批量创建灯笼
    const flylightGroup = new THREE.Group()
    for (let i = 0; i < flyLightNum; i++) {
      const flyLight = lightBox.clone()
      // 随机设置灯笼的位置
      const x = (Math.random() - 0.5) * 300
      const y = Math.random() * 40 + 20
      const z = (Math.random() - 0.5) * 300
      flyLight.position.set(x, y, z)
      // 设置灯笼动画
      gsap.to(flyLight.rotation, {
        y: 2 * Math.PI,
        duration: 10 + Math.random() * 30,
        repeat: -1
      })
      gsap.to(flyLight.position, {
        x: '+=' + Math.random() * 5,
        y: '+=' + Math.random() * 20,
        yoyo: true,
        duration: Math.random() * 10 + 5,
        repeat: -1
      })
      flylightGroup.add(flyLight)
    }
    model.add(flylightGroup)
  })
}

// 创建水面效果
const createWater = () => {
  const waterGeometry = new THREE.PlaneGeometry(100, 100)
  const water = new Water(waterGeometry, {
    scale: 4,
    textureHeight: 1024,
    textureWidth: 1024
  })
  water.position.y = 1
  water.rotation.x = -Math.PI / 2
  model.add(water)
}

// 放烟花
const createFireworks = (event: any) => {
  // 随机设置烟花颜色
  const color = new THREE.Color(
    `hsl(${Math.floor(Math.random() * 360)},100%,80%)`
  )
  const { x, y } = usePointer(event)
  let py = y
  if (y < 0) py = 0
  const position = {
    x: x * 20,
    z: 0,
    y: 1 + py * 25
  }
  // 创建烟花
  const firework = useFireWork({
    color,
    to: position,
    scene
  }) as any
  fireworks.push(firework)
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
  // 更新烟花时间
  fireworks.forEach((firework, index) => {
    const type = firework.update()
    if (type === 'complete') {
      fireworks.splice(index, 1)
    }
  })
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
  // 监听点击事件
  renderer.domElement.addEventListener('click', createFireworks)
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
  // 取消点击事件
  renderer.domElement.removeEventListener('click', createFireworks)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
