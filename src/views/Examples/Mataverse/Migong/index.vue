<template>
  <div class="mi-gong">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- 遮罩层 -->
    <STip v-if="isShowTip" @handleStart="handleStart" />
    <!-- 标签渲染 -->
    <div ref="tagRef"></div>
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
// 导入CSS3D
import {
  CSS2DObject,
  CSS2DRenderer
} from 'three/examples/jsm/renderers/CSS2DRenderer'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  useProgress,
  useGLTFModel,
  useOctree,
  useHowler,
  usePositionAudio
} from '@/hooks'
import {
  useThree,
  useRunSound,
  useChatTag,
  useChatTagTween,
  useNpcTween
} from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import STip from './components/STip/index.vue'
// 导入类型
import type { IActions, IKeyStates } from './types'
// 导入常量
import {
  firstPersonPerspectiveCamera,
  thirdPersonPerspectiveCamera,
  playerPosition,
  girlPosition,
  playerChatTexts,
  girlChatTexts
} from './constants'
// 导入动画
import * as TWEEN from '@tweenjs/tween.js'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 标签渲染
const tagRef = ref<HTMLDivElement | null>(null)
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
// 键盘按键状态
const keyStates: IKeyStates = {
  KeyW: false,
  KeyA: false,
  KeyS: false,
  KeyD: false,
  isDown: false
}
// 玩家最大速度
const maxV = 5
// 是否是第三人称
let isThirdView = true
// 触发position事件数组
const eventPositionList: any[] = []
// 玩家标签
let playerChatTag: CSS2DObject | null
// NPC标签
let girlChatTag: CSS2DObject | null
// 当前对话的次数
let currentChatIndex = 0

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  css2Renderer: CSS2DRenderer, // css3渲染器
  status: Status, // 性能监视器
  model: THREE.Group, // 网格模型
  worldOctree: Octree, // 世界八叉树
  capsule: Capsule, // 胶囊体
  planeGroup: THREE.Group, // 碰撞组
  player: THREE.Object3D, // 玩家
  robot: any, // 玩家实体模型
  girl: any, // 女孩
  mixer: THREE.AnimationMixer, // 动画混合器
  cameraEmptyBox: THREE.Object3D, // 相机的父元素
  activeAction: THREE.AnimationAction, // 当前执行的机器人动作
  sound: any, // 玩家行走的声音
  howler: any, // 背景音乐
  spotLight: any, // 聚光灯
  directionLight: any // 平行光

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    spotLight: mSpotLight,
    CSS2DRenderer: mCSS2DRenderer
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  spotLight = mSpotLight
  css2Renderer = mCSS2DRenderer
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加css3DRenderer
  tagRef.value?.appendChild(css2Renderer.domElement)
}

// 开始游戏
const handleStart = async () => {
  // 关闭遮罩层
  isShowTip.value = false
  // 播放背景音乐
  howler = (await useHowler({
    src: './voice/bg_kongbu.mp3',
    volume: 0.5
  })) as any
  howler.play()
  // 鼠标锁定
  handleMouseDown()
  // 将NPC位置加入位置数组中
  onPosition(girlPosition, handlePlayerInGirl, handlePlayerOutGirl)
}

// 进入NPC范围内
const handlePlayerInGirl = () => {
  // 1.创建玩家会话标签
  let playerText: string, grilText: string
  if (currentChatIndex > playerChatTexts.length) {
    currentChatIndex = 0
  }
  playerText = playerChatTexts[currentChatIndex]
  grilText = girlChatTexts[currentChatIndex]
  // 2.创建玩家聊天框
  playerChatTag = useChatTag({
    model: robot,
    text: playerText
  })
  const { playerChatIn, playerChatOut, NpcChatIn, NpcChatOut } =
    useChatTagTween()
  playerChatIn.start().onComplete(() => {
    setTimeout(() => {
      playerChatOut.start().onComplete(() => {
        robot.remove(playerChatTag)
        playerChatTag = null
        // 创建NPC聊天框
        girlChatTag = useChatTag({
          model: girl,
          text: grilText,
          tagId: 'npc-chat-tag'
        })
        NpcChatIn.start().onComplete(() => {
          setTimeout(() => {
            NpcChatOut.start().onComplete(() => {
              girl.remove(girlChatTag)
              girlChatTag = null
              // npc渐隐动画执行
              const npcOutTween = useNpcTween({
                npc: girl,
                player: robot
              })
              npcOutTween.onComplete((obj) => {
                // 将NPC新的位置重新添加至eventPositionList数组中
                eventPositionList.splice(0)
                onPosition(
                  obj.position,
                  handlePlayerInGirl,
                  handlePlayerOutGirl
                )
              })
            })
          }, 1500)
        })
      })
    }, 1500)
  })
  // 3.修改对话内容下标
  currentChatIndex++
}

// 离开NPC范围
const handlePlayerOutGirl = () => {
  const { playerChatOut, NpcChatOut } = useChatTagTween()
  if (playerChatTag) {
    playerChatOut.start().onComplete(() => {
      robot.remove(playerChatTag)
      playerChatTag = null
    })
  }
  if (girlChatTag) {
    NpcChatOut.start().onComplete(() => {
      robot.remove(girlChatTag)
      girlChatTag = null
    })
  }
}

// 初始化玩家
const initPlayer = async () => {
  // 1.创建一个空对象，用于可视化玩家
  player = new THREE.Object3D()
  player.position.set(0, 0.85, 0)
  scene.add(player)
  // 2.添加相机，实现跟随效果
  addCamera()
  // 3.创建玩家行走的声音源
  sound = await useRunSound({ path: './voice/walk.mp3' })
  player.add(sound)
  // 4.添加玩家光源
  player.add(spotLight)
  spotLight.target = player
  spotLight.position.z -= 1
  // 5.默认隐藏平行光
  directionLight = scene.getObjectByName('平行光')
  directionLight!.visible = false
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
  const target = front.normalize().multiplyScalar(1)
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
}

// 加载场景模型
const initSceneModel = async () => {
  // 1.加载模型
  const gltf: any = await useGLTFModel({
    path: './models/迷宫.glb',
    isDraco: false
  })
  // 2.设置碰撞组
  planeGroup = new THREE.Group()
  planeGroup.add(gltf.scene)
  model.add(planeGroup)
  // 3.创建物理世界
  const physical = useOctree({ planeGroup })
  worldOctree = physical.worldOctree
  capsule = physical.capsule
  // 4.加载机器人模型
  initRobotModel()
  // 5.加载二次元女生模型
  initGirlModel()
}

// 加载机器人模型
const initRobotModel = async () => {
  const gltf: any = await useGLTFModel({ path: './models/people.glb' })
  robot = gltf.scene
  robot.scale.set(0.5, 0.5, 0.5)
  robot.position.copy(playerPosition)
  // 可视化robot
  player.add(robot)
  // 处理动画
  mixer = new THREE.AnimationMixer(robot)
  for (let i = 0; i < gltf.animations.length; i++) {
    let name = gltf.animations[i].name
    actions[name] = mixer.clipAction(gltf.animations[i])
    if (name == 'idle' || name == 'walk') {
      actions[name].clampWhenFinished = false
      actions[name].loop = THREE.LoopRepeat
    }
  }
  activeAction = actions['idle']
  activeAction && activeAction.play()
}

// 加载NPC模型
const initGirlModel = async () => {
  const gltf: any = await useGLTFModel({
    path: './models/girl.glb',
    isDraco: true
  })
  girl = gltf.scene
  girl.scale.set(0.5, 0.5, 0.5)
  girl.rotation.y = Math.PI
  girl.position.copy(girlPosition)
  // 创建NPC声音
  const girlSound = (await usePositionAudio({
    path: './voice/xiao_kongbu.mp3',
    volume: 5
  })) as any
  girl.sound = girlSound
  girl.add(girlSound)
  model.add(girl)
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
      maxV
    ) {
      playerVelocity.add(front.multiplyScalar(delta * 2))
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
    playerVelocity.setX(0).setZ(0)
    if (playerVelocity.y < maxV) {
      playerVelocity.y += 0.5
    } else {
      // 打开场景中的平行光
      if (!directionLight.visible) {
        directionLight.visible = true
      }
    }
  }
}

// 更新玩家位置
const updatePlayer = (delta: number) => {
  // 1.玩家处于地面上
  if (playerOnFloor) {
    // y方向上的速度设为0
    playerVelocity.y = 0
    // 隐藏场景中的平行光
    if (directionLight.visible) {
      directionLight.visible = false
    }
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
  // 同步修改玩家的位置
  const capsulePosition = new THREE.Vector3(0, 0, 0)
  capsule && capsule.getCenter(capsulePosition)
  player && player.position.copy(capsulePosition)
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
    Math.abs(playerVelocity.x) + Math.abs(playerVelocity.z) <= maxV
  ) {
    fadeToAction('walk')
    if (!sound.isPlaying) {
      sound.play()
    }
  } else {
    fadeToAction('idle')
    if (sound.isPlaying) {
      sound.stop()
    }
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
  if (player.position.y < -10) {
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
  if (event.code === 'KeyV') {
    isThirdView = !isThirdView
    if (isThirdView) {
      camera.position.z -= 2
    } else {
      camera.position.z += 2
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
  } else if (cameraEmptyBox.rotation.x < Math.PI / 30) {
    cameraEmptyBox.rotation.x = Math.PI / 30
  }
}

// 监听NPC位置
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

// 触发位置事件
const emitPositionEvent = () => {
  eventPositionList.forEach((item) => {
    // 计算玩家距离某个点的距离，判断是否触发事件
    const distanceToSquared = player.position.distanceToSquared(item.position)
    // 进入
    if (distanceToSquared < item.radius && item.isInner === false) {
      item.isInner = true
      item.inCallback && item.inCallback()
    }
    // 离开
    if (distanceToSquared > item.radius && item.isInner === true) {
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
  // css2d
  css2Renderer && css2Renderer.render(scene!, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新动画时间
  mixer && mixer.update(delta)
  // 更新人物位置
  if (player.visible && document.pointerLockElement) {
    // 控制人物行走
    controlPlayer(delta)
    // 更新玩家位置
    updatePlayer(delta)
    // 判断玩家位置，是否进入NPC范围
    emitPositionEvent()
    // 重置玩家位置
    resetPlayer()
  }
  // 更新动画时间
  TWEEN && TWEEN.update()
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
  if (css2Renderer) {
    css2Renderer.setSize(width, height)
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
  // 停止行走声音
  if (sound && sound.isPlaying) {
    sound.stop()
  }
  // 停止背景音乐
  if (howler) {
    howler.stop()
  }
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
