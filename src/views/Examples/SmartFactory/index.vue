<template>
  <div class="smart-factory">
    <div class="btn-operation">
      <el-button size="large" plain round @click="handlePlay">
        {{ isPlaying ? '暂停' : '播放' }}
      </el-button>
      <el-button size="large" plain round @click="handleRain"> 下雨 </el-button>
    </div>
    <div ref="statusRef"></div>
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

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 动画是否在播放
const isPlaying = ref<boolean>(false)
// 精灵个数
const N = 16000
// three变量
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRender,
  status: Status,
  controls: OrbitControls,
  mixer: THREE.AnimationMixer,
  clipAction: THREE.AnimationAction,
  spriteGroup: THREE.Group

// 2.初始化
const init = () => {
  // 2.1.创建场景
  initScene()
  // 2.2.辅助观察坐标系
  initHelper()
  // 2.3.设置光源
  initLights()
  // 2.4.创建相机
  initCamera()
  // 2.5.创建渲染器
  initRender()
  // 2.6.加载模型
  // initModel()
  // 2.7.初始化性能监视器
  initStatus()
  // 2.8.初始化相机控件
  initControls()
  // 渲染
  animate()
}

// 初始化场景
const initScene = () => {
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0xffffff, 0.5)
  // 设置天空盒
  initHDR()
}

const initHDR = () => {
  // 初始化hdr加载器
  const hdrLoader = new RGBELoader()
  hdrLoader.load('./hdr/sky1.hdr', (texture) => {
    // 设置图像将如何应用到物体（对象）上，像圆一样四周环绕整个场景
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  })
}

// 初始化观察坐标系
const initHelper = () => {
  const axesHelper = new THREE.AxesHelper(50)
  scene.add(axesHelper)
}

// 设置光源
const initLights = () => {
  // 3.1.平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(100, 60, 50)
  scene.add(directionalLight)
  // 3.2.环境光
  const ambient = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambient)
}

// 创建相机
const initCamera = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  camera = new THREE.PerspectiveCamera(30, width / height, 10, 3000)
  // 设置相机的位置
  camera.position.set(202, 123, 125)
  // 设置相机的朝向
  camera.lookAt(0, 0, 0)
}

// 创建渲染器
const initRender = () => {
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('webgl') as HTMLCanvasElement,
    antialias: true // 抗锯齿
  })
  // 设置设备像素比
  renderer.setPixelRatio(window.devicePixelRatio)
  // 设置输出画布大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置颜色空间
  renderer.outputEncoding = THREE.sRGBEncoding
}

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
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    }
  )
}

// 模拟场景中下雨的效果
const initRain = () => {
  const texture = new THREE.TextureLoader().load('./images/sprite/rain.png')
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

// 初始化性能监视器
const initStatus = () => {
  status = new Status()
  statusRef.value.appendChild(status.dom)
}

//初始化相机控件
const initControls = () => {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  // 开启缓动动画
  controls.enableDamping = true
  controls.enablePan = false
  controls.enableZoom = true
  // 内外移动距离
  controls.maxDistance = 400
  controls.minDistance = 100
  // 最大仰角
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI / 2
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  // 获取上下两针时间间隔
  const delta = clock.getDelta()
  // 设置渲染器输出画布大小
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机控制器
  controls && controls.update()
  // 更新动画时间
  mixer && mixer.update(delta)
  // 更新雨滴的位置
  if (spriteGroup) {
    spriteGroup.children.forEach((sprite) => {
      // 雨滴的y坐标每次减t*60
      sprite.position.y -= 60 * delta
      if (sprite.position.y < 0) {
        sprite.position.y = 600
      }
    })
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

// 模拟下雨效果
const handleRain = () => {
  initRain()
}

watch(
  () => [width, height],
  ([newWidth, newHeight]) => {
    handleResize(newWidth.value, newHeight.value)
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  init()
  // 监听窗口变化
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
