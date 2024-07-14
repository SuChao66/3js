<template>
  <div class="hourse">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- 小地图 -->
    <div class="map" v-if="!isLoading">
      <div class="tag" ref="tagDiv"></div>
      <img :src="hourseMap" alt="" />
    </div>
    <!-- 控制按钮 -->
    <SControl v-if="!isLoading" @changeRoom="changeRoom" />
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
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  useProgress,
  // useCanvasSprite,
  usePointer,
  useRayCaster
} from '@/hooks'
import { useThree, useRoom } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import SControl from './components/SControl/index.vue'
// 导入图片
import hourseMap from '@/assets/images/hourse-map.gif'
// 导入动画库
import gsap from 'gsap'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 小地图标注
const tagDiv = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)
// 精灵文本数组
const sprites: THREE.Sprite[] = []
// 房间数组
const rooms = [
  {
    name: '客厅',
    roomIndex: 0,
    texturePath: './textures/hourse/livingroom/',
    position: new THREE.Vector3(0, 0, 0),
    euler: new THREE.Euler(0, 0, 0),
    textPosition: new THREE.Vector3(-4, 0, -6)
  },
  {
    name: '厨房',
    roomIndex: 3,
    texturePath: './textures/hourse/kitchen/',
    position: new THREE.Vector3(-5, 0, -15),
    euler: new THREE.Euler(0, -Math.PI / 2, 0),
    textPosition: new THREE.Vector3(-1, 0, -3)
  },
  {
    name: '阳台',
    roomIndex: 8,
    texturePath: './textures/hourse/balcony/',
    position: new THREE.Vector3(0, 0, 15),
    euler: new THREE.Euler(0, 0, 0),
    textPosition: new THREE.Vector3(0, 0, 3)
  },
  {
    name: '主卧',
    roomIndex: 18,
    texturePath: './textures/hourse/bedroom/',
    position: new THREE.Vector3(-40, 0, 12),
    euler: new THREE.Euler(0, 0, 0),
    textPosition: new THREE.Vector3(0, 0, 3)
  },
  {
    name: '儿童房',
    roomIndex: 13,
    texturePath: './textures/hourse/childroom/',
    position: new THREE.Vector3(-40, 0, -15),
    euler: new THREE.Euler(0, 0, 0),
    textPosition: new THREE.Vector3(0, 0, 3)
  },
  {
    name: '老人房',
    roomIndex: 14,
    texturePath: './textures/hourse/elderroom/',
    position: new THREE.Vector3(-20, 0, 15),
    euler: new THREE.Euler(0, 0, 0),
    textPosition: new THREE.Vector3(0, 0, 3)
  },
  {
    name: '走廊',
    roomIndex: 9,
    texturePath: './textures/hourse/corridor/',
    position: new THREE.Vector3(-15, 0, 0),
    euler: new THREE.Euler(0, 0, 0),
    textPosition: new THREE.Vector3(0, 0, 3)
  }
]
// 小地图标签数组
const mapTagPositions = [
  {
    name: '客厅',
    position: [100, 110]
  },
  {
    name: '厨房',
    position: [180, 190]
  },
  {
    name: '阳台',
    position: [50, 50]
  },
  {
    name: '主卧',
    position: [150, 20]
  },
  {
    name: '老人房',
    position: [100, 40]
  },
  {
    name: '儿童房',
    position: [200, 80]
  },
  {
    name: '走廊',
    position: [150, 60]
  }
]

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  status: Status, // 性能监视器
  controls: OrbitControls

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
  rooms.forEach((room) => {
    const roomCube = useRoom({
      name: room.name,
      roomIndex: room.roomIndex,
      texturePath: room.texturePath,
      position: room.position,
      euler: room.euler
    })
    // const textSprite = useCanvasSprite({
    //   text: room.name,
    //   position: room.textPosition,
    //   scale: new THREE.Vector3(0.5, 0.5, 0.5)
    // })
    // sprites.push(textSprite)
    // scene.add(textSprite)
    scene.add(roomCube)
  })
}

// 鼠标点击事件
const handleMouseClick = (event: any) => {
  const { x, y } = usePointer(event)
  const chooseSprite = useRayCaster({
    x,
    y,
    camera,
    chooseObjArr: sprites
  })
  if (chooseSprite) {
    // 更新相机的位置和朝向
    const roomItem = rooms.find((room) => room.name === chooseSprite.name)
    updateCamera(roomItem)
    // 更新小地图的位置
    const mapTag = mapTagPositions.find((map) => map.name === chooseSprite.name)
    moveTag(mapTag!.position)
  }
}

// 切换房间
const changeRoom = (name: string) => {
  const roomItem = rooms.find((room) => room.name === name)
  updateCamera(roomItem)
  // 更新小地图的位置
  const mapTag = mapTagPositions.find((map) => map.name === name)
  moveTag(mapTag!.position)
}

// 更新相机位置和朝向
const updateCamera = (roomItem: any) => {
  // 更新相机的位置和朝向
  gsap.to(camera.position, {
    duration: 1,
    x: roomItem?.position.x,
    y: roomItem?.position.y,
    z: roomItem?.position.z
  })
  let tx, ty, tz
  tx = roomItem!.position.x
  ty = roomItem!.position.y
  tz =
    roomItem!.position.z < 0
      ? roomItem!.position.z - 0.01
      : roomItem!.position.z + 0.01
  controls.target.set(tx, ty, tz)
  controls.update()
}

// 移动小地图图标
const moveTag = (positions: number[]) => {
  gsap.to(tagDiv.value, {
    duration: 0.5,
    x: positions[0],
    y: positions[1],
    ease: 'power3.inOut'
  })
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

watch(
  () => isLoading,
  (val) => {
    if (!val.value) {
      nextTick(() => {
        moveTag(mapTagPositions[0].position)
      })
    }
  },
  { deep: true }
)

onMounted(() => {
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
  // 注册点击事件
  renderer.domElement.addEventListener('click', handleMouseClick)
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
  // 取消点击事件
  renderer.domElement.removeEventListener('click', handleMouseClick)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
