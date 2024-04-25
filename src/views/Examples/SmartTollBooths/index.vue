<template>
  <div class="smart-toll-booths">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- 车道收费站标签 -->
    <SLangLable />
    <!-- 收费窗口标签 -->
    <SWindowLabel :name="currentChooseModelName" />
    <!-- 车道标签渲染 -->
    <div ref="laneTagRef"></div>
    <!-- 收费窗口渲染 -->
    <div ref="windowTagRef"></div>
    <!-- 控制按钮 -->
    <transition name="fade">
      <SControl
        v-if="!isLoading && dangGanArr.length > 0"
        :dangGans="dangGanArr"
        @handleSpriteClick="handleSpriteClick"
      />
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
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入GLTF加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入draco解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入CSS3DRenderer
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
// 后处理
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
// 导入动画库
import * as TWEEN from '@tweenjs/tween.js'
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  usePointer,
  useRayCaster,
  useGroupRayCaster,
  useCSS2DObject
} from '@/hooks'
import {
  useThree,
  useLaneLabel,
  useWindowLabelTween,
  usePointTag
} from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import SLangLable from './components/SLangLabel/index.vue'
import SWindowLabel from './components/SWindowLabel/index.vue'
import SControl from './components/SControl/index.vue'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(false)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)
// 车道标签DOM
const laneTagRef = ref<HTMLDivElement | null>(null)
// 窗口标签DOM
const windowTagRef = ref<HTMLDivElement | null>(null)
// 当前射线拾取的窗口模型
let currentChooseModel: any
let currentChooseModelName = ref<string>('')
// 相机动画是否执行中
const isExecutTween = ref<boolean>(false)
// 挡杆精灵模型数组
let spriteArr: THREE.Sprite[] = []
// 挡杆模型数组
let dangGanArr = ref<any[]>([])

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  CSS3LabelRenderer: CSS3DRenderer, // css3D渲染器
  CSS2LabelRenderer: CSS2DRenderer, // css2D渲染器
  model: THREE.Group, // 模型集合
  status: Status, // 性能监视器
  controls: OrbitControls, // 相机控制器
  composer: EffectComposer, // 后处理
  outlinePass: OutlinePass

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    css3Drenderer: mCss3Drenderer,
    css2Drenderer: mCss2Drenderer,
    controls: mControls,
    status: mStatus,
    composer: mComposer,
    outlinePass: mOutlinePass
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  controls = mControls
  renderer = mRenderer
  CSS3LabelRenderer = mCss3Drenderer
  CSS2LabelRenderer = mCss2Drenderer
  composer = mComposer
  outlinePass = mOutlinePass
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加css3DRenderer
  laneTagRef.value?.appendChild(CSS3LabelRenderer.domElement)
  // 添加css2DRenderer
  windowTagRef.value?.appendChild(CSS2LabelRenderer.domElement)
}

// 加载模型
const initModel = () => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load(
    './models/收费站.glb',
    (gltf) => {
      // 声明一个组对象，用来添加加载成功的三维场景
      model = new THREE.Group()
      // model添加到场景中
      scene.add(model)
      model.add(gltf.scene)
      // 创建车道标签
      useLaneLabel(model)
      // 给每一个收费窗口增加动画
      useWindowLabelTween(model, camera, controls)
      // 给每一个收费站挡杆设置热点精灵
      const { spriteArr: SpriteArr, dangGanArr: DangGanArr } =
        usePointTag(model)
      spriteArr = SpriteArr
      dangGanArr.value = DangGanArr
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        setTimeout(() => {
          isLoading.value = false
        }, 300)
      }
    }
  )
}

// 射线拾取：收费窗口拾取
const handlePointerClick = (e: Event) => {
  // 相机动画执行中，禁止鼠标射线拾取
  if (isExecutTween.value) return
  if (currentChooseModel) {
    currentChooseModel = null
    outlinePass.selectedObjects = []
  }
  // 转换鼠标点击坐标
  const { x, y } = usePointer(e)
  // 获取收费窗口模型
  const chuangkou = model!.getObjectByName('收费窗口')
  // 计算射线拾取
  const chooseObj = useGroupRayCaster({
    x,
    y,
    chooseObjArr: chuangkou?.children,
    camera
  })
  if (chooseObj) {
    currentChooseModel = chooseObj
    currentChooseModelName.value = currentChooseModel.name
    // 创建窗口标签
    const dom = document.getElementById('windowTag') as HTMLDivElement
    dom.style.top = '-100px' //指示线端点放在标注点附近
    const windowTag = useCSS2DObject({ dom })
    // 添加标签到模型中
    model!.add(windowTag)
    // 获取收费窗口世界坐标
    const pos = new THREE.Vector3()
    currentChooseModel.getWorldPosition(pos)
    const offet = new THREE.Vector3(-1, 1, 0)
    pos.add(offet)
    // 设置标签的位置
    windowTag.position.copy(pos)
    // 设置后处理
    outlinePass.selectedObjects = [chooseObj]
    // 执行相机动画
    executeWindowTween()
  }
}

// 执行窗口动画
const executeWindowTween = () => {
  currentChooseModel.in.start()
  currentChooseModel.fadeIn.start()
  currentChooseModel.in.onStart(function () {
    isExecutTween.value = true
  })
  currentChooseModel.in.onComplete(function () {
    // 延迟3s执行退出动画
    currentChooseModel.out.delay(3000)
    currentChooseModel.out.start()
    // 当退出动画开始执行后，同步执行标签渐隐动画
    currentChooseModel.out.onStart(function () {
      currentChooseModel.fadeOut.start()
    })
    currentChooseModel.out.onComplete(function () {
      isExecutTween.value = false
      outlinePass.selectedObjects = []
      currentChooseModel = null
    })
  })
}

// 射线拾取，挡杆热点精灵拾取
const handleSpriteClick = (e: Event) => {
  // 1.转换鼠标点击坐标
  const { x, y } = usePointer(e)
  // 2.获取射线拾取模型
  const chooseObj = useRayCaster({
    x,
    y,
    camera,
    chooseObjArr: spriteArr
  }) as any
  if (chooseObj) {
    const gz = dangGanArr.value[chooseObj.i]
    // 判断挡杆的状态
    if (gz.open) {
      // 执行挡杆动画
      gz.closeTween.start()
      // 修改挡杆状态
      gz.open = false
    } else {
      // 执行挡杆动画
      gz.openTween.start()
      // 修改挡杆状态
      gz.open = true
    }
  }
}

// 渲染
// const clock = new THREE.Clock()
const animate = () => {
  // 获取上下两针时间间隔
  // const delta = clock.getDelta()
  // 渲染器渲染
  renderer && renderer.render(scene!, camera)
  composer && composer.render()
  // css3D渲染器渲染
  CSS3LabelRenderer && CSS3LabelRenderer.render(scene, camera)
  // css2D渲染器渲染
  CSS2LabelRenderer && CSS2LabelRenderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新TWEEN
  TWEEN.update()
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
  // 重新设置css3DLabel输出画布大小
  if (CSS3LabelRenderer) {
    CSS3LabelRenderer.setSize(width, height)
  }
  // 重新设置css2DLabel输出画布大小
  if (CSS2LabelRenderer) {
    CSS2LabelRenderer.setSize(width, height)
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
  // 注册鼠标点击事件
  renderer.domElement.addEventListener('click', handlePointerClick)
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
  // 注册鼠标点击事件
  renderer.domElement.removeEventListener('click', handlePointerClick)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
