<template>
  <div class="future-smart-city">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- 遮罩层 -->
    <STip v-if="isShowTip" @handleStart="handleStart" />
    <!-- canvas画布 -->
    <canvas id="webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
// 导入THREE
import * as THREE from 'three'
// 导入八叉树
import { Octree } from 'three/examples/jsm/math/Octree.js'
// 导入胶囊
import { Capsule } from 'three/examples/jsm/math/Capsule.js'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  useProgress,
  useGLTFModel,
  useOctree
} from '@/hooks'
import {
  useThree,
  useVideoPlane,
  useCanvasPlane,
  usePortals,
  useVideotext,
  useMusic
} from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import STip from './components/STip/index.vue'
// 导入类型
import type { IActions, IKeyStates } from './types'
// 导入常量
import {
  firstPersonPerspectiveCamera,
  thirdPersonPerspectiveCamera
} from './constants'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 是否展示操作提示
const isShowTip = ref<boolean>(false)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)
// 机器人动作列表
const actions: IActions = {}
// 重力
const gravity = -9.8
// 摩擦力
const damping = -0.25
// 玩家速度
let playerVelocity = new THREE.Vector3(0, 0, 0)
// 玩家是否在地面上
let playerOnFloor = false
// 是否第三人称
let isThirdView = true
// 键盘按键状态
const keyStates: IKeyStates = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  Space: false,
  isDown: false
}
// 传送门坐标
const portalsPosition = new THREE.Vector3(0, -0.5, 0)
// 音乐喷泉光阵坐标
const lightCirclePosition = new THREE.Vector3(-4.8, -0.5, 18)
// 触发position事件数组
const eventPositionList: any[] = []
// 视频文本提示数组
const textVideoArrays: any[] = []

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  status: Status, // 性能监视器
  model: THREE.Group, // 网格模型
  worldOctree: Octree, // 世界八叉树
  capsule: Capsule, // 胶囊体
  planeGroup: THREE.Group, // 碰撞组
  player: THREE.Object3D, // 玩家
  mixer: THREE.AnimationMixer, // 动画混合器
  activeAction: THREE.AnimationAction, // 当前执行的机器人动作
  cameraEmptyBox: THREE.Object3D, // 相机的父元素
  portals: THREE.Group, // 传送门
  lightCircle: THREE.Mesh, // 音乐喷泉光泉
  canvasPlane: any, // 音乐喷泉提示信息(图片)
  textVideoPlane: any, // 音乐喷泉提示信息(视频)
  musicGroup: any // 音乐载体

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
}

// 开始游戏
const handleStart = () => {
  // 关闭遮罩层
  isShowTip.value = false
  // 打开传送门
  portals.visible = true
  // 显示人物
  setTimeout(() => {
    player.visible = true
  }, 1000)
  // 将音乐喷泉光阵加入位置数组中
  onPosition(
    lightCirclePosition,
    handlePlayerInFountain,
    handlePlayerOutFountain
  )
}

// 玩家进入音乐喷泉
const handlePlayerInFountain = async () => {
  console.log('进入光圈')
  lightCircle.visible = false
  // canvasPlane.visible = true
  textVideoPlane.visible = true
  // 播放音频
  if (!musicGroup) {
    musicGroup = (await useMusic({
      position: lightCirclePosition.setY(-1).setZ(20),
      path: './voice/gnzw.mp3'
    })) as any
    model.add(musicGroup.mesh)
  }
}

// 玩家离开音乐喷泉
const handlePlayerOutFountain = () => {
  console.log('离开光圈')
  lightCircle.visible = true
  // canvasPlane.visible = false
  textVideoPlane.visible = false
}

// 初始化玩家
const initPlayer = () => {
  player = new THREE.Object3D()
  player.position.set(0, 0.85, 0)
  scene.add(player)
  // 添加相机
  addCamera()
  // 默认不展示机器人
  player.visible = false
}

// 将相机添加至玩家，实现跟随效果
const addCamera = () => {
  // 设置相机的位置
  cameraEmptyBox = new THREE.Object3D()
  if (isThirdView) {
    camera.position.copy(thirdPersonPerspectiveCamera)
  } else {
    camera.position.copy(firstPersonPerspectiveCamera)
  }
  // 设置相机的朝向
  const front = new THREE.Vector3(0, 0, 0)
  player.getWorldDirection(front)
  const target = front.normalize().multiplyScalar(5)
  camera.lookAt(target)
  // 更新相机投影矩阵
  camera.updateProjectionMatrix()
  // 添加至玩家模型中，实现跟随效果
  cameraEmptyBox.add(camera)
  player.add(cameraEmptyBox)
}

// 加载模型
const initModel = async () => {
  model = new THREE.Group()
  scene.add(model)

  // 1.加载场景模型
  initSceneModel()
  // 2.创建传送门
  portals = usePortals({
    videoSrc: './video/lightCircle.mp4',
    position: portalsPosition,
    size: new THREE.Vector2(2, 2)
  })
  model.add(portals)
  // 3.添加喷泉旁的光阵视频纹理
  lightCircle = useVideoPlane({
    videoSrc: './video/lightCircle2.mp4',
    position: lightCirclePosition,
    size: new THREE.Vector2(5, 3)
  })
  model.add(lightCircle)
  // 4.添加喷泉旁的提示信息
  canvasPlane = await useCanvasPlane({
    position: lightCirclePosition.setY(1.3).setZ(20),
    euler: new THREE.Euler(0, Math.PI, 0),
    imageSrc: './textures/chat.png',
    text: '听首音乐放松一下吧'
  })
  // model.add(canvasPlane)
  // 5.视频背景提示信息
  const textVideo = useVideotext({
    videoSrc: './video/chatFrame.mp4',
    position: lightCirclePosition.setY(1.3).setZ(20),
    euler: new THREE.Euler(0, Math.PI, 0),
    text: '听首音乐放松一下吧'
  })
  textVideoPlane = textVideo.mesh
  model.add(textVideoPlane)
  textVideoArrays.push(textVideo)
}

// 加载场景模型
const initSceneModel = async () => {
  // 1.加载模型
  const gltf: any = await useGLTFModel({ path: './models/city/metaScene.glb' })
  model.add(gltf.scene)
  // 2.设置碰撞组
  planeGroup = new THREE.Group()
  planeGroup.position.copy(gltf.scene.children[0].position)
  model.add(planeGroup)
  // 遍历模型，地面，墙作为碰撞组
  const planeArr = [
    'KB3D_DLA_ConcreteRiverRock',
    'KB3D_DLA_ConcreteScreedTan',
    'KB3D_DLA_ConcretePittedGrayLight'
  ]
  gltf.scene.traverse((child: any) => {
    if (child.isMesh && child.material) {
      if (planeArr.includes(child.material.name)) {
        planeGroup.add(child.clone())
        child.visible = false
      }
    }
  })
  // 3.创建物理世界
  const physical = useOctree({ planeGroup })
  worldOctree = physical.worldOctree
  capsule = physical.capsule
  // 4.加载机器人模型
  initRobotModel()
}

// 加载机器人模型
const initRobotModel = async () => {
  const gltf: any = await useGLTFModel({ path: './models/xRobot.glb' })
  const robot = gltf.scene
  robot.position.set(0, -0.6, 0)
  // 可视化robot
  player.add(robot)
  // 处理动画
  mixer = new THREE.AnimationMixer(robot)
  for (let i = 0; i < gltf.animations.length; i++) {
    let name = gltf.animations[i].name
    actions[name] = mixer.clipAction(gltf.animations[i])
    if (name == 'idle' || name == 'walk' || name == 'run') {
      actions[name].clampWhenFinished = false
      actions[name].loop = THREE.LoopRepeat
    } else {
      actions[name].clampWhenFinished = true
      actions[name].loop = THREE.LoopOnce
    }
  }
  activeAction = actions['idle']
  activeAction && activeAction.play()
}

// 控制玩家行走，前、后、左、右、跳跃
const controlPlayer = (delta: number) => {
  // W：前进
  if (keyStates['KeyW']) {
    // 获取玩家正前面方向
    const front = new THREE.Vector3(0, 0, 0)
    player.getWorldDirection(front)
    // 计算玩家的速度，当速度超过最大速度时，不操作
    if (
      playerVelocity.x * playerVelocity.x +
        playerVelocity.z * playerVelocity.z <=
      200
    ) {
      playerVelocity.add(front.multiplyScalar(delta * 5))
    }
  }
  // S：后退
  if (keyStates['KeyS']) {
    // 获取玩家正前面方向
    const front = new THREE.Vector3(0, 0, 0)
    player.getWorldDirection(front)
    // 计算玩家的速度
    playerVelocity.add(front.multiplyScalar(-delta))
  }
  // A：左
  if (keyStates['KeyA']) {
    // 获取玩家正前面方向
    const front = new THREE.Vector3(0, 0, 0)
    player.getWorldDirection(front)
    // 获取玩家上方向，正前方向量与上方向向量叉乘，获取左右方向
    front.cross(player.up)
    // 计算玩家的速度
    playerVelocity.add(front.multiplyScalar(-delta))
  }
  // D：右
  if (keyStates['KeyD']) {
    // 获取玩家正前面方向
    const front = new THREE.Vector3(0, 0, 0)
    player.getWorldDirection(front)
    // 获取上方向，正前方向量与上方向向量叉乘，获取左右方向
    front.cross(player.up)
    // 计算玩家的速度
    playerVelocity.add(front.multiplyScalar(delta))
  }
  // space：跳跃
  if (keyStates['Space']) {
    playerVelocity.y = 5
    fadeToAction('idle')
  }
}

// 更新玩家位置
const updatePlayer = (delta: number) => {
  // 1.玩家处于地面上
  if (playerOnFloor) {
    playerVelocity.y = 0 // y方向上的速度为0
    // 抬起鼠标，降低速度至0
    if (!keyStates.isDown) {
      playerVelocity.addScaledVector(playerVelocity, damping)
    }
  } else {
    // 2.玩家不在地面上，掉落的情况，修改y方向的速度
    playerVelocity.y += gravity * delta
  }
  // 3.计算玩家移动的距离
  const playerMoveDis = playerVelocity.clone().multiplyScalar(delta)
  // 4.修改胶囊体的位置
  capsule && capsule.translate(playerMoveDis)
  // 5.进行碰撞检测，result有值，表示碰撞检测到了
  playerCollisions()
  // 6.切换玩家动作
  switchPlayerAction()
}

// 碰撞检测
const playerCollisions = () => {
  const result = worldOctree && worldOctree.capsuleIntersect(capsule)
  // 默认不在地面上
  playerOnFloor = false
  if (result) {
    playerOnFloor = result.normal.y > 0
    // 修改胶囊体的位置，使其不碰撞
    capsule.translate(result.normal.multiplyScalar(result.depth))
    // 同步修改玩家的位置
    const capsulePosition = new THREE.Vector3(0, 0, 0)
    capsule && capsule.getCenter(capsulePosition)
    player && player.position.copy(capsulePosition)
  }
}

// 切换玩家动作
const switchPlayerAction = () => {
  if (
    Math.abs(playerVelocity.x) + Math.abs(playerVelocity.z) > 0.1 &&
    Math.abs(playerVelocity.x) + Math.abs(playerVelocity.z) <= 3
  ) {
    fadeToAction('walk')
  } else if (Math.abs(playerVelocity.x) + Math.abs(playerVelocity.z) > 3) {
    fadeToAction('run')
  } else {
    fadeToAction('idle')
  }
}

// 动作修改
const fadeToAction = (actionName: string) => {
  const prevAction = activeAction
  activeAction = actions[actionName]
  if (activeAction !== prevAction) {
    // 退出当前动作
    prevAction?.fadeOut(0.3)
    // 执行当前动作
    activeAction
      ?.reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(0.3)
      .play()
    // 执行其他动作结束后，恢复idle状态
    mixer?.addEventListener('finished', () => {
      const prevAction = activeAction
      activeAction = actions['idle']
      // 退出当前动作
      prevAction?.fadeOut(0.3)
      // 执行当前动作
      activeAction
        ?.reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(0.3)
        .play()
    })
  }
}

// 重置玩家
const resetPlayer = () => {
  if (player.position.y < -20) {
    // 重置胶囊体位置
    capsule.start.set(0, 5.35, 0)
    capsule.end.set(0, 6.35, 0)
    capsule.radius = 0.35
    // 重置速度
    playerVelocity.set(0, 0, 0)
  }
}

// 键盘事件
const handleKeyDown = (event: any) => {
  keyStates[event.code] = true
  keyStates.isDown = true
}
const handleKeyUp = (event: any) => {
  keyStates[event.code] = false
  keyStates.isDown = false
  // V：切换视角
  if (event.code === 'KeyV') {
    isThirdView = !isThirdView
    if (isThirdView) {
      camera.position.z -= 6
    } else {
      camera.position.z += 6
    }
    camera.updateProjectionMatrix()
  }
}

// 鼠标事件
// 鼠标按下，进入指针锁定
const handleMouseDown = () => {
  if (isShowTip.value) return
  // 锁定鼠标指针
  document.body.requestPointerLock()
}
// 鼠标移动，修改人物视角
const handleMouseMove = (event: any) => {
  // 判断是否处于鼠标指针锁定状态
  if (!document.pointerLockElement) return
  // 左右视线
  player.rotation.y -= event.movementX * 0.003
  // 上下视线
  cameraEmptyBox.rotation.x += event.movementY * 0.003
  if (cameraEmptyBox.rotation.x > Math.PI / 6) {
    cameraEmptyBox.rotation.x = Math.PI / 6
  } else if (cameraEmptyBox.rotation.x < Math.PI / 20) {
    cameraEmptyBox.rotation.x = Math.PI / 20
  }
}

// 监听位置
const onPosition = (
  position: THREE.Vector3,
  inCallback: any,
  outCallback: any,
  radius = 2
) => {
  const newPosition = position.clone()
  eventPositionList.push({
    position: newPosition,
    inCallback,
    outCallback,
    isInner: false,
    radius
  })
}

// 位置触发
const emitPositionEvent = () => {
  eventPositionList.forEach((item) => {
    // 计算玩家距离某个点的距离，判断是否触发事件
    const distanceToSquared = player.position.distanceToSquared(item.position)
    // 进入
    if (
      distanceToSquared < Math.pow(item.radius, 2) &&
      item.isInner === false
    ) {
      item.isInner = true
      item.inCallback && item.inCallback()
    }
    // 离开
    if (distanceToSquared > Math.pow(item.radius, 2) && item.isInner === true) {
      item.isInner = false
      item.outCallback && item.outCallback()
    }
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
  // 更新动画时间
  mixer && mixer.update(delta)
  if (player.visible) {
    // 控制人物行走
    controlPlayer(delta)
    // 更新玩家位置
    updatePlayer(delta)
    // 重置玩家位置
    resetPlayer()
    // 判断玩家的位置
    emitPositionEvent()
    // 更新视频提示信息背景
    if (textVideoArrays.length > 0) {
      for (let i = 0; i < textVideoArrays.length; i++) {
        textVideoArrays[i].update()
      }
    }
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

watch(
  () => isLoading.value,
  (newVal) => {
    if (!newVal) {
      isShowTip.value = true
    }
  },
  { immediate: true, deep: true }
)

onMounted(async () => {
  // 初始化
  init()
  // 初始化玩家
  initPlayer()
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
  // 注册键盘事件
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)
  // 注册鼠标事件
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
  // 移除键盘事件
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keyup', handleKeyUp)
  // 移除鼠标事件
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mousemove', handleMouseMove)
  // 停止音乐播放
  musicGroup && musicGroup.sound.stop()
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
