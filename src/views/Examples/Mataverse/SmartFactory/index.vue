<template>
  <div class="smart-factory">
    <!-- 交互控制 -->
    <div class="btn-operation" v-if="!isLoading">
      <SControls
        :isPlaying="isPlaying"
        :isFlyPlaying="isFlyPlaying"
        :isRoaming="isRoaming"
        @handlePlay="handlePlay"
        @handleEnvironment="handleEnvironment"
        @handleFly="handleFly"
        @handleRoaming="handleRoaming"
      />
    </div>
    <!-- 标签 -->
    <div id="tag" style="display: none">
      <STag
        v-bind="cunchuInfo[currentSelectModel]"
        @handleClose="handleClose"
      />
    </div>
    <!-- 标签渲染 -->
    <div ref="tagRef"></div>
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
// 导入draco解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入八叉树
import { Octree } from 'three/examples/jsm/math/Octree.js'
// 导入胶囊
import { Capsule } from 'three/examples/jsm/math/Capsule.js'
// 导入CSS2D
import {
  CSS2DObject,
  CSS2DRenderer
} from 'three/examples/jsm/renderers/CSS2DRenderer'
// 导入动画库
import * as TWEEN from '@tweenjs/tween.js'
// 导入hooks
import {
  useWindowSize,
  useOctree,
  usePointer,
  useCameraTween,
  useProgress
} from '@/hooks'
import { useThree } from './hook/useThree.ts'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import STag from './components/STag/index.vue'
import SControls from './components/SControls/index.vue'
import { ElMessage } from 'element-plus'
// 导入hook
import { useStatusByEnv } from '@/hooks'
// 导入配置文件
import { cunchuInfo } from './constants'
// 导入配置文件
import type { IKeyStates } from './types'
// 导入常量
import {
  firstPersonPerspectiveCamera,
  thirdPersonPerspectiveCamera
} from './constants'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 标签渲染
const tagRef = ref<HTMLDivElement | null>(null)
// 动画是否在播放
const isPlaying = ref<boolean>(false)
// 精灵个数
const N = 8000
// 当前环境中的效果，下雨/下雪
let currentEnvironemnt: string = ''
// 模型加载进度
const currentProgress = ref<number>(0)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 场景定时器
const timer = ref<number>(0)
// 无人机定时器
const flyTimer = ref<number>(0)
// 是否正在无人机巡厂
const isFlyPlaying = ref<boolean>(false)
// 是否开启宇宙漫游
const isRoaming = ref<boolean>(false)
// three变量
let scene: THREE.Scene | null, // 场景
  model: THREE.Group | null = new THREE.Group(), // 模型集合
  factory: THREE.Group, // 工厂模型
  fly: THREE.Group | null, // 无人机模型
  player: THREE.Group | null, // 人模型
  camera: THREE.PerspectiveCamera, // 相机
  cameraGroup: THREE.Group = new THREE.Group(), // 相机组
  renderer: THREE.WebGLRenderer, // 渲染器
  css2Renderer: CSS2DRenderer, // 标签渲染器
  status: Status, // 性能监视器
  controls: OrbitControls, // 相机控制器
  mixer: THREE.AnimationMixer, // 动画播放器（卡车）
  planeMixer: THREE.AnimationMixer, // 动画播放器（无人机）
  playerMixer: THREE.AnimationMixer, // 动画播放器（玩家）
  clipAction: THREE.AnimationAction, // 卡车动画
  planeClipAction: THREE.AnimationAction, // 无人机动画
  idleClipAction: THREE.AnimationAction, // 休息
  walkClipAction: THREE.AnimationAction, // 走路
  runClipAction: THREE.AnimationAction, // 跑步
  spriteGroup: THREE.Group, // 精灵模型
  selectModel: THREE.Object3D, // 选择的模型
  cameraPos: THREE.Vector3, // 相机初始位置
  controlsTarget: THREE.Vector3, // 相机初始target
  worldOctree: Octree, // 世界八叉树
  capsule: Capsule // 胶囊体
// 当前选择的存储罐
const currentSelectModel = ref<string>('')
// tag标签
let tag: CSS2DObject
// 定义无人机绕飞半径和高度
const flyInfo = {
  R: 120,
  H: 50
}
// 无人机的停放位置
const flyPosition = new THREE.Vector3(-25, 0, 10)
// 玩家的位置
const playerPosition = new THREE.Vector3(-15, -0.675, 30)
const keyStates: IKeyStates = {
  // 使用W、A、S、D按键来控制前、后、左、右运动
  // false表示没有按下，true表示按下状态
  W: false,
  A: false,
  S: false,
  D: false
}
// 工厂碰撞组
const factoryPlaneArr = ['路面', '地面']
const factoryPlaneGroupArr = [
  '大货车',
  '大货车1',
  '大货车2',
  '仓库',
  '设备A',
  '设备B'
]
const planeGroup = new THREE.Group()
// 定义玩家漫游的速度
const v = new THREE.Vector3(0, 0, 0)
// 玩家加速度
const a = 12
// 定义地面摩擦力系数（阻尼系数）
const damping = -0.15
// 重力
const gravity = -9.8
// 玩家是否在地面上
let playerOnFloor = false
// 是否第三人称
let isThirdView = true
// 俯仰角度范围
const angleMin = THREE.MathUtils.degToRad(-1)
const angleMax = THREE.MathUtils.degToRad(15)

onMounted(() => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    css2Renderer: mCss2Renderer,
    controls: mControls,
    status: mStatus,
    cameraPos: mCameraPos,
    controlsTarget: mControlsTarget
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  controls = mControls
  renderer = mRenderer
  css2Renderer = mCss2Renderer
  cameraPos = mCameraPos
  controlsTarget = mControlsTarget
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加css2DRenderer
  tagRef.value?.appendChild(css2Renderer.domElement)
  // 注册鼠标点击事件
  renderer.domElement.addEventListener('click', handlePointerClick)
  // 初始化标签
  initTag()
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

// 加载模型
const initModel = () => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load('./models/factory.glb', (gltf) => {
    // 保存模型
    factory = gltf.scene
    model!.add(factory)
    // 处理卡车动画
    handleCarAnimation(gltf)
    // 处理工厂模型，确定碰撞组
    handlePlane(factory)
    // 创建物理世界
    createWorldOctree()
    // 加载无人机模型
    initPlaneModel()
    // 加载人模型
    initHumanModel()
  })
}

// 加载无人机
const initPlaneModel = () => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load('./models/plane.glb', (gltf) => {
    fly = gltf.scene
    fly.scale.set(0.25, 0.25, 0.25)
    fly.position.set(-25, 0.5, 10)
    model!.add(fly)
    // 播放无人机动画
    planeMixer = new THREE.AnimationMixer(gltf.scene)
    // 获取gltf.animations[0]的第一个clip动画对象
    planeClipAction = planeMixer.clipAction(gltf.animations[0])
  })
}

// 加载人模型
const initHumanModel = () => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load('./models/xRobot.glb', (gltf) => {
    player = new THREE.Group()
    // 设置玩家的大小和位置
    player.position.copy(playerPosition)
    // 添加至场景中
    model!.add(player)
    scene!.add(model!)
    // 保存机器人模型
    const robot = gltf.scene
    robot.position.y -= 0.6
    // 可视化robot
    player.add(robot)
    // 处理机器人动作
    handleRobotAnimation(gltf)
  })
}

// 处理卡车动画
const handleCarAnimation = (gltf: any) => {
  // 播放关键帧动画
  mixer = new THREE.AnimationMixer(gltf.scene)
  // 获取gltf.animations[0]的第一个clip动画对象
  clipAction = mixer.clipAction(gltf.animations[0])
  // 播放动画
  clipAction.play()
  // 暂停状态
  clipAction.paused = true
}

// 处理工厂模型碰撞组
const handlePlane = (factory: any) => {
  factory.traverse((child: any) => {
    if (child.isObject3D && factoryPlaneGroupArr.includes(child.name)) {
      planeGroup.add(child.clone())
    }
    if (child.isMesh && factoryPlaneArr.includes(child.name)) {
      planeGroup.add(child.clone())
    }
  })
}

// 创建物理世界
const createWorldOctree = () => {
  const physical = useOctree({
    planeGroup,
    start: new THREE.Vector3(-15, 0.35, 30),
    end: new THREE.Vector3(-15, 1, 30)
  })
  worldOctree = physical.worldOctree
  capsule = physical.capsule
}

// 处理机器人动画
const handleRobotAnimation = (gltf: any) => {
  // 获取人的关键帧动画
  const animations = gltf.animations
  // 创建玩家动画播放器
  playerMixer = new THREE.AnimationMixer(gltf.scene)
  // 创建动画对象
  idleClipAction = playerMixer.clipAction(animations[0])
  walkClipAction = playerMixer.clipAction(animations[6])
  runClipAction = playerMixer.clipAction(animations[3])
  // 播放动画
  idleClipAction.play()
  walkClipAction.play()
  runClipAction.play()
  // 通过权重来设置动画
  idleClipAction.weight = 1.0
  walkClipAction.weight = 0.0
  runClipAction.weight = 0.0
}

// 切换人物动作
const changeAction = (name: string) => {
  if (name === 'idle') {
    idleClipAction.weight = 1.0
    walkClipAction.weight = 0.0
    runClipAction.weight = 0.0
  } else if (name === 'walk') {
    idleClipAction!.weight = 0.0
    walkClipAction!.weight = 1.0
    runClipAction.weight = 0.0
  } else {
    idleClipAction!.weight = 0.0
    walkClipAction!.weight = 0.0
    runClipAction.weight = 1.0
  }
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  // 获取上下两针时间间隔
  const delta = clock.getDelta()
  // 渲染器渲染
  renderer && renderer.render(scene!, camera)
  // CSS2D
  css2Renderer && css2Renderer.render(scene!, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机控制器
  if (!isRoaming.value) {
    controls && controls.update()
  }
  // 更新卡车动画时间
  mixer && mixer.update(delta)
  // 更新无人机动画时间
  planeMixer && planeMixer.update(delta)
  // 更新玩家动画
  playerMixer && playerMixer.update(delta)
  // 更新TWEEN
  TWEEN.update()
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
  // 玩家宇宙漫游，更新玩家位置
  updatePlayer(delta)
  // 重置玩家
  resetPlayer()
}

// 播放卡车动画
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

// 无人机巡厂
const handleFly = () => {
  if (isFlyPlaying.value) {
    restoryfFly()
    return
  } else {
    executeFly()
  }
}

// 无人机停放到初始位置
const restoryfFly = () => {
  // 停止无人机巡厂
  cancelAnimationFrame(flyTimer.value)
  // 获取无人机的位置
  const flyWorldPosition = new THREE.Vector3()
  fly!.getWorldPosition(flyWorldPosition)
  // 设置无人机停放的位置
  new TWEEN.Tween({
    x: flyWorldPosition.x,
    y: flyWorldPosition.y,
    z: flyWorldPosition.z
  })
    .to({
      x: flyPosition.x,
      y: flyPosition.y,
      z: flyPosition.z
    })
    .onUpdate((obj) => {
      fly!.position.x = obj.x
      fly!.position.y = obj.y
      fly!.position.z = obj.z
    })
    .onComplete(() => {
      // 恢复完整视角
      createCameraTween(cameraPos, controlsTarget)
      planeClipAction.stop()
      isFlyPlaying.value = false
    })
    .start()
}

// 执行飞行动画
const executeFly = () => {
  // 1.播放无人机动画
  planeClipAction.play()
  isFlyPlaying.value = true
  // 2.无人机起飞至指定位置
  new TWEEN.Tween({ x: -25, y: 0 })
    .to({ x: -flyInfo.R, y: flyInfo.H }, 5000)
    .onUpdate((obj) => {
      fly!.position.x = obj.x
      fly!.position.y = obj.y
      // 保持无人机镜头一直对准旋转中心
      const b = target.clone().sub(fly!.position).normalize()
      // 计算当前位置相对初始位置需要旋转的角度
      const q = new THREE.Quaternion()
      q.setFromUnitVectors(a, b) // a到b向量旋转的角度
      const newQ = q0.clone().multiply(q)
      fly!.quaternion.copy(newQ)
    })
    .onComplete(() => {
      // 获取无人机的世界坐标
      const flyWorldPosition = new THREE.Vector3()
      fly!.getWorldPosition(flyWorldPosition)
      // 计算相机的位置
      const endPositionX = flyWorldPosition.clone().x - 10
      const endPositionY = flyWorldPosition.clone().y + 2
      const endPositionZ = flyWorldPosition.clone().z
      const endPosition = new THREE.Vector3(
        endPositionX,
        endPositionY,
        endPositionZ
      )
      // 相机移动
      createCameraTween(endPosition, flyWorldPosition)
      // 执行绕飞运动
      setTimeout(() => {
        loop()
      }, 2500)
    })
    .start()
  // 3.无人机朝向（无人机相机镜头方向）
  const a = new THREE.Vector3(0, 0, 1)
  // 绕转中心的坐标
  const target = new THREE.Vector3(0, flyInfo.H, 0)
  // 无人机姿态角度初始值
  const q0 = fly!.quaternion.clone()
  // 定义开始角度
  let angle = 0
  function loop() {
    flyTimer.value = requestAnimationFrame(loop)
    angle += 0.005
    // 无人机y坐标不变，在平行于X0Z的平面上做圆周运动
    const x = -flyInfo.R * Math.cos(angle)
    const z = -flyInfo.R * Math.sin(angle)
    fly!.position.x = x
    fly!.position.z = z
    // 保持无人机镜头一直对准旋转中心
    const b = target.clone().sub(fly!.position).normalize()
    // 计算当前位置相对初始位置需要旋转的角度
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(a, b) // a到b向量旋转的角度
    const newQ = q0.clone().multiply(q)
    fly!.quaternion.copy(newQ)
    // 旋转相机
    const cx = -(flyInfo.R + 20) * Math.cos(angle)
    const cy = flyInfo.H + 10
    const cz = -(flyInfo.R + 30) * Math.sin(angle)
    camera.position.set(cx, cy, cz)
    // 更新相机的朝向
    controls.target.set(0, 0, 0)
    controls.update() // 内部会执行.lookAt()，相当于执行相机的lookAt
  }
}

// 宇宙漫游
const handleRoaming = () => {
  if (isRoaming.value) {
    isRoaming.value = false
    // 退出漫游，将相机移至初始位置
    player?.remove(cameraGroup)
    // 恢复完整视角
    createCameraTween(cameraPos, controlsTarget)
  } else {
    ElMessage({
      message: '当前为第三人称宇宙漫游，键盘V可切换至第一人称模式',
      type: 'success',
      plain: true
    })
    // 打开漫游
    isRoaming.value = true
    // 将相机添加到玩家的模型中
    if (isThirdView) {
      camera.position.copy(thirdPersonPerspectiveCamera)
    } else {
      camera.position.copy(firstPersonPerspectiveCamera)
    }
    // 设置相机的朝向
    const front = new THREE.Vector3(0, 0, 0)
    player!.getWorldDirection(front)
    const target = front.normalize().multiplyScalar(2)
    camera.lookAt(target)
    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
    // 添加至玩家模型中，实现跟随效果
    cameraGroup.add(camera)
    player?.add(cameraGroup)
    // 进入指针锁定模式
    document.body.requestPointerLock()
  }
}

// 模拟场景中下雨或者下雪的效果
const initRainOrSnow = (texture: THREE.Texture) => {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture
  })
  spriteGroup = new THREE.Group()
  scene!.add(spriteGroup)
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

// 模拟下雨/下雪效果
const handleEnvironment = (type: string) => {
  // 1.判断场景中是否有下雨或者下雪的效果
  if (spriteGroup) {
    spriteGroup.traverse((item: any) => {
      if (item.type === 'Sprite') {
        item.material.dispose()
      }
    })
    scene!.remove(spriteGroup)
  }
  if (type === 'rain') {
    const texture: THREE.Texture = new THREE.TextureLoader().load(
      './images/sprite/rain.png'
    )
    currentEnvironemnt = 'rain'
    initRainOrSnow(texture)
  } else {
    const texture: THREE.Texture = new THREE.TextureLoader().load(
      './images/sprite/snow.png'
    )
    currentEnvironemnt = 'snow'
    initRainOrSnow(texture)
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
  // 重新设置css2Renderer的尺寸
  if (css2Renderer) {
    css2Renderer.setSize(width, height)
  }
}

// 鼠标点击射线拾取
const handlePointerClick = (e: Event) => {
  // 转换鼠标点击坐标
  const { x, y } = usePointer(e)
  // 创建一个射线投射器
  const raycaster = new THREE.Raycaster()
  //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
  // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
  // 获取存储罐模型
  const cunchu = factory.getObjectByName('存储罐')
  for (let i = 0; i < cunchu!.children.length; i++) {
    const group = cunchu?.children[i]
    group?.traverse((obj: any) => {
      if (obj.isMesh) {
        // 子对象增加ancestors属性，指向父对象，保证射线拾取时，选中的是整个父对象
        obj.ancestors = group
      }
    })
  }
  // 射线交叉计算拾取模型
  const intersects = raycaster.intersectObjects(cunchu!.children)
  if (intersects.length > 0) {
    selectModel = (intersects[0].object as any).ancestors as THREE.Object3D
    // 设置当前选中的模型的名称
    currentSelectModel.value = selectModel.name
    // 当前模型添加标签
    selectModel.add(tag)
    new TWEEN.Tween({ opacity: 0.0 })
      .to({ opacity: 1.0 })
      .onUpdate((obj) => {
        document.getElementById('tag')!.style.opacity =
          obj.opacity as unknown as string
      })
      .start()
    // 获取选中模型的世界坐标
    const selectModelworldPosition = new THREE.Vector3()
    selectModel.getWorldPosition(selectModelworldPosition)
    // 相机飞行到的位置和观察目标拉开一定距离
    const cameraPos = selectModelworldPosition.clone().addScalar(30)
    // 相机从当前位置camera.position飞行到三维场景中某个世界坐标附近
    createCameraTween(cameraPos, selectModelworldPosition)
  }
}

// 初始化标签
const initTag = () => {
  // 标签标注
  const div = document.getElementById('tag') as HTMLElement
  div.style.top = '-100px' //指示线端点放在标注点附近
  // HTML元素转化为threejs的CSS2模型对象
  tag = new CSS2DObject(div)
}

// 关闭标签
const handleClose = () => {
  if (selectModel) {
    new TWEEN.Tween({ opacity: 1.0 })
      .to({ opacity: 0.0 })
      .onUpdate((obj) => {
        document.getElementById('tag')!.style.opacity =
          obj.opacity as unknown as string
      })
      .onComplete(() => {
        selectModel.remove(tag)
      })
      .start()
    // 恢复完整视角
    createCameraTween(cameraPos, controlsTarget)
  }
}

// 鼠标按下事件，宇宙漫游
document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyW') keyStates.W = true
  if (event.code === 'KeyA') keyStates.A = true
  if (event.code === 'KeyS') keyStates.S = true
  if (event.code === 'KeyD') keyStates.D = true
})

document.addEventListener('keyup', (event) => {
  if (event.code === 'KeyW') keyStates.W = false
  if (event.code === 'KeyA') keyStates.A = false
  if (event.code === 'KeyS') keyStates.S = false
  if (event.code === 'KeyD') keyStates.D = false
  // 第一人称和第三人称切换
  if (event.code === 'KeyV') {
    isThirdView = !isThirdView
    if (isThirdView) {
      camera.position.z -= 6
    } else {
      camera.position.z += 6
    }
    camera.updateProjectionMatrix()
  }
})

// 鼠标移动事件
document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === document.body) {
    // 左右旋转
    if (player) {
      player!.rotation.y -= event.movementX / 600
    }
    // 上下旋转,视角上下俯仰，修改玩家角色的子对象cameraGroup
    // 如果修改的是玩家的角度，玩家在视角上会与地面平行
    cameraGroup.rotation.x -= event.movementY / 600
    if (cameraGroup.rotation.x < angleMin) {
      cameraGroup.rotation.x = angleMin
    }
    if (cameraGroup.rotation.x > angleMax) {
      cameraGroup.rotation.x = angleMax
    }
  }
})

// 更新玩家位置
const updatePlayer = (delta: number) => {
  // 通过速度大小，设置相应的动画
  if (isRoaming.value) {
    // 加速前进
    if (keyStates.W) {
      let front = new THREE.Vector3()
      player!.getWorldDirection(front) // 默认方向与z轴正方向平行
      // delta时间短内，速度的变化量，v = v0 + at
      // 初始速度 + 速度的变化量
      v.add(front.multiplyScalar(a * delta))
    } else if (keyStates.S) {
      // 后退
      let front = new THREE.Vector3()
      player!.getWorldDirection(front)
      front.multiplyScalar(-1)
      // delta时间短内，速度的变化量，v = v0 + at
      // 初始速度 + 速度的变化量
      v.add(front.multiplyScalar(a * delta))
    } else if (keyStates.A) {
      // 往左
      let front = new THREE.Vector3() // 前方
      player!.getWorldDirection(front)
      front.multiplyScalar(-1)
      const up = new THREE.Vector3(0, 1, 0) // 上方向
      const left = front.cross(up)
      v.add(left.multiplyScalar(a * delta))
    } else if (keyStates.D) {
      // 往右
      const front = new THREE.Vector3() // 前方
      player!.getWorldDirection(front)
      const up = new THREE.Vector3(0, 1, 0) // 上方向
      const right = front.cross(up)
      v.add(right.multiplyScalar(a * delta))
    }
    // 阻尼设置
    // v = v * (1-0.04) = v * (1 + damping) = v + v * damping
    // .addScaledVector(v, s)：将所传入的v与s相乘所得的乘积和这个向量相加。
    if (playerOnFloor) {
      v.y = 0
      v.addScaledVector(v, damping)
    } else {
      v.y += delta * gravity
    }
    // delta时间段内位置改变量
    const deltaPos = v.clone().multiplyScalar(delta)
    // 修改胶囊体的位置
    capsule && capsule.translate(deltaPos)
    // 碰撞检测
    playerCollisions()
    // 切换人物动作
    switchPlayerAction()
  }
}

// 碰撞检测
const playerCollisions = () => {
  const result = worldOctree && worldOctree.capsuleIntersect(capsule)
  // 默认不在地面上
  playerOnFloor = false
  // result有值，表示与物体碰撞到了
  if (result) {
    playerOnFloor = result.normal.y > 0
    // 移动capusle胶囊体，使其不碰撞
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
    Math.abs(v.x) + Math.abs(v.z) > 0.1 &&
    Math.abs(v.x) + Math.abs(v.z) <= 7
  ) {
    changeAction('walk')
  } else if (Math.abs(v.x) + Math.abs(v.z) > 7) {
    changeAction('run')
  } else {
    changeAction('idle')
  }
}

// 重置玩家位置
const resetPlayer = () => {
  if (player && player.position.y < -20) {
    // 重置胶囊体位置
    capsule.start.set(-15, 0.35, 30)
    capsule.end.set(-15, 1, 30)
    capsule.radius = 0.35
    // 重置速度
    v.set(0, 0, 0)
  }
}

// 创建相机动画
const createCameraTween = (endPos: THREE.Vector3, endTarget: THREE.Vector3) => {
  useCameraTween(camera.position, controls.target, endPos, endTarget)
    .onUpdate((obj) => {
      // 更新相机的位置坐标
      camera.position.set(obj.x, obj.y, obj.z)
      // 动态计算相机视线
      controls.target.set(obj.tx, obj.ty, obj.tz)
      controls.update() // 内部会执行.lookAt()，相当于执行相机的lookAt
    })
    .start()
}

watch(
  () => [width, height],
  ([newWidth, newHeight]) => {
    handleResize(newWidth.value, newHeight.value)
  },
  { immediate: true, deep: true }
)

onUnmounted(() => {
  // 移除renderer鼠标点击事件
  renderer.domElement.removeEventListener('click', handlePointerClick)
  renderer.domElement.remove()
  renderer.clear()
  scene!.traverse((item: any) => {
    if (item.isMesh) {
      item.geometry.dispose()
      item.material.dispose()
      if (item.texture) {
        item.texture.dispose()
      }
      scene!.remove(item)
    }
  })
  scene = null
  fly = null
  player = null
  model = null
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
  cancelAnimationFrame(flyTimer.value)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
