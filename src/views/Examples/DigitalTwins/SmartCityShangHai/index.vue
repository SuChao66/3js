<template>
  <div class="smart-city">
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
// 导入hooks
import { useWindowSize, useStatusByEnv, useLon2Mercator } from '@/hooks'
import {
  useThree,
  useBuildMaterial,
  useConeMesh,
  useLightSphere,
  useSignalMesh
} from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
// 导入常量
import { cameraTarget } from './constants'

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
  controls: OrbitControls,
  model: THREE.Group, // 上海网格模型
  flyGroup: THREE.Group, // 无人机
  mixer: THREE.AnimationMixer

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
    './models/上海外滩_draco.glb',
    (gltf) => {
      // 把gltf.scene中的所有模型添加到model组对象中
      model.add(gltf.scene)
      // 1.处理河流
      const river = gltf.scene.getObjectByName('黄浦江') as any
      river.material = new THREE.MeshLambertMaterial({
        color: river.material.color
      })
      // 2.处理楼房
      const build = gltf.scene.getObjectByName('楼房') as any
      build.material = new THREE.MeshLambertMaterial({
        // color: 0x00ffff
        color: 0x00aaaa, //场景大可以暗一些  要不然整个屏幕太亮
        transparent: true, //允许透明计算
        opacity: 0.7 //半透明设置
      })
      useBuildMaterial({
        build
      })
      // 3.创建四棱锥标注场景
      const coneMesh = useConeMesh({
        size: 40,
        x: cameraTarget.x,
        y: cameraTarget.y
      })
      model.add(coneMesh)
      // 4.加载无人机
      initFly()
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        isLoading.value = false
      }
    }
  )

  // 1.渲染上海外滩
  // const shanghai = (await useShangHai({
  //   path: './data/城市建筑数据/GeoJSON数据/上海/上海外滩.json'
  // })) as any
  // model.add(shanghai)
  // // 2.创建黄浦江
  // const river = (await useHuangPuRiver({
  //   path: './data/城市建筑数据/GeoJSON数据/上海/黄浦江.json'
  // })) as any
  // model.add(river)

  // // 关闭loading
  isLoading.value = false
}

// 加载无人机
const initFly = () => {
  flyGroup = new THREE.Group()
  const { x, y } = useLon2Mercator(cameraTarget.x, cameraTarget.y)
  flyGroup.position.set(x, y, 600)
  flyGroup.translateX(28 * 25)
  model.add(flyGroup)
  // 加载无人机模型
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/gltf/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load('./models/plane.glb', (gltf: any) => {
    // 保存无人机模型
    const fly = gltf.scene
    // 根据需要放大无人机
    fly.scale.set(4, 4, 4)
    // 播放无人机动画
    mixer = new THREE.AnimationMixer(fly)
    const AnimationAction = mixer.clipAction(gltf.animations[0])
    AnimationAction.timeScale = 15
    AnimationAction.play()
    // 创建光球，包裹无人机
    const lightSphere = useLightSphere({
      radius: 200
    })
    // 创建信号波
    const signal = useSignalMesh()
    flyGroup.add(fly)
    flyGroup.add(lightSphere)
    flyGroup.add(signal)
  })
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  const delta = clock.getDelta()
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机控件
  controls && controls.update()
  // 更新动画
  if (mixer) {
    mixer.update(delta)
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
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
