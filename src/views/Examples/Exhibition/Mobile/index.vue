<template>
  <div class="mobile">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- GUI控制器 -->
    <div ref="guiRef"></div>
    <!-- 控制按钮 -->
    <SControls v-if="!isLoading" :mesh="mobilePhoneMesh" />
    <!-- 相机标签 -->
    <STag @handleClose="handleClose" />
    <div ref="cameraTagRef"></div>
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
import {
  useWindowSize,
  useStatusByEnv,
  useGuiByEnv,
  usePointer,
  useRayCaster,
  useCSS2DObject,
  useFont
} from '@/hooks'
import { useThree, usePointsTag } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import SControls from './components/SControls/index.vue'
import STag from './components/STag/index.vue'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// GUI控制器
const guiRef = ref<HTMLDivElement | null>(null)
// 相机标签渲染
const cameraTagRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)
// 手机模型
const mobilePhoneMesh = ref<THREE.Mesh | null>(null)
// 圆弧半径
const R = 50
// 旋转角度
let angle = 0

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  css2DRenderer: CSS2DRenderer, // css2渲染器
  model: THREE.Group, // 模型集合
  status: Status, // 性能监视器
  textureCube: THREE.CubeTexture, // 环境贴图
  sprite: THREE.Sprite, // 光点精灵
  gui: any

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    textureCube: mTextureCube,
    gui: mGui,
    css2DRenderer: mCss2DRenderer
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  css2DRenderer = mCss2DRenderer
  textureCube = mTextureCube
  gui = mGui
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加GUI
  if (useGuiByEnv()) {
    guiRef.value?.appendChild(mGui.domElement)
  }
  // 添加css2DRenderer
  cameraTagRef.value?.appendChild(css2DRenderer.domElement)
}

// 加载模型
const initModel = () => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load(
    './models/手机.glb',
    (gltf) => {
      model = new THREE.Group()
      model.add(gltf.scene)
      // 1.将模型添加至场景中
      scene.add(model)
      // 2.给相机摄像头标注精灵图
      const endObject3D = model.getObjectByName('后置摄像头位置')
      sprite = usePointsTag({
        model: endObject3D,
        path: './images/sprite/光点.png'
      })
      model.add(sprite)
      // 3.给手机设置贴图
      const phoneMesh = model.getObjectByName('手机') as THREE.Mesh
      mobilePhoneMesh.value = phoneMesh
      setMobilePhoneMesh(phoneMesh)
      // 4.初始化gui控制器
      initGUI()
      // 5.创建圆弧线条
      initArc()
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        isLoading.value = false
      }
    }
  )
}

// 设置手机的渲染效果
const setMobilePhoneMesh = (mesh: THREE.Mesh) => {
  // 1.创建纹理贴图加载器
  const textureLoader = new THREE.TextureLoader()
  // 2.设置手机网格模型的材质
  const material = new THREE.MeshStandardMaterial({
    metalness: 1.0, // 金属度
    roughness: 0.6, // 粗糙度
    map: textureLoader.load('./texture/basecolor.png'), // 颜色贴图
    // 金属度、粗糙度贴图表示的值会和金属度、粗糙度分别相乘
    roughnessMap: textureLoader.load('./texture/roughness.png'),
    metalnessMap: textureLoader.load('./texture/metallic.png'),
    // 相机镜头等位置需要设置半透明效果(设置alphaMap和transparent属性)
    alphaMap: textureLoader.load('./texture/opacity.png'), //alpha贴图
    normalMap: textureLoader.load('./texture/normal.png'), //法线贴图
    transparent: true, // 使用alphaMap，需要开启透明计算
    envMap: textureCube, // 环境贴图
    envMapIntensity: 0.5 // 设置环境贴图对模型表面影响程度
  })
  // 3.设置纹理的朝向flipY
  material!.map!.flipY = false
  material!.metalnessMap!.flipY = false
  material!.roughnessMap!.flipY = false
  material!.alphaMap!.flipY = false
  material!.normalMap!.flipY = false
  mesh.material = material
}

// 创建GUI控制器
const initGUI = () => {
  gui.add(mobilePhoneMesh.value?.material, 'metalness', 0, 1).name('金属度')
  gui.add(mobilePhoneMesh.value?.material, 'roughness', 0, 1).name('粗糙度')
  gui
    .add(mobilePhoneMesh.value?.material, 'envMapIntensity', 0, 1)
    .name('环境贴图强度')
  gui.addColor(scene, 'background').name('背景色')
}

// 创建圆弧底座
const initArc = async () => {
  // 1.创建缓冲几何体
  const geometry = new THREE.BufferGeometry()
  // 2.创建圆弧
  const arc = new THREE.ArcCurve(
    0,
    0,
    R,
    Math.PI / 2 + Math.PI / 6,
    Math.PI / 2 - Math.PI / 6,
    false
  )
  // 获取圆弧线上的点
  const points = arc.getPoints(50)
  // setFromPoints方法从points中提取数据改变几何体的顶点位置数据.attributes.position
  geometry.setFromPoints(points)
  // 3.创建材质
  const colorsArr = []
  const c1 = new THREE.Color(0xff0000) //曲线起点颜色 红色
  const c2 = new THREE.Color(0x00ffff) //曲线结束点颜色 青色
  const pos = geometry.attributes.position
  const count = pos.count //顶点数量
  for (let i = 0; i < count; i++) {
    const percent = i / count // 点索引值相对所有点数量的百分比
    //根据顶点位置顺序大小设置颜色渐变
    const c = c1.clone().lerp(c2, percent) //颜色插值计算
    colorsArr.push(c.r, c.g, c.b)
  }
  //类型数组创建顶点颜色color数据
  const colors = new Float32Array(colorsArr)
  geometry.attributes.color = new THREE.BufferAttribute(colors, 3)
  const material = new THREE.LineBasicMaterial({
    // color: 0xffffff //线条颜色
    vertexColors: true
  })
  // 4.创建线条模型对象
  const line = new THREE.Line(geometry, material)
  line.rotateX(Math.PI / 2)
  // 线模型和720符号父对象
  const CircleLine = new THREE.Group()
  CircleLine.add(line)
  CircleLine.position.y -= 78 //平移到产品的底部
  model.add(CircleLine)
  model.position.y += 20
  // 5.创建字体加载器
  const textMesh = (await useFont({
    path: './fonts/helvetiker_bold.typeface.json',
    text: '720°'
  })) as THREE.Mesh
  textMesh.position.z = R
  textMesh.position.x = -12
  CircleLine.add(textMesh)
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  // 时间差
  const delta = clock.getDelta()
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // css2D渲染器
  css2DRenderer && css2DRenderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 旋转模型
  angle = delta * 0.5
  model && model.rotateY(angle)
}

// 射线拾取
const handlePointerClick = (e: Event) => {
  // 转换鼠标点击坐标
  const { x, y } = usePointer(e)
  // 计算射线拾取
  const chooseObj = useRayCaster({
    x,
    y,
    chooseObjArr: [sprite],
    camera
  })
  if (chooseObj) {
    // 1.创建tag
    const dom = document.getElementById('camera') as HTMLDivElement
    dom.style.left = 250 + 'px'
    const label = useCSS2DObject({ dom })
    const endObject3D = model.getObjectByName('后置摄像头位置')
    // 2.添加到模型上
    endObject3D?.add(label)
  }
}

// 关闭标签
const handleClose = () => {
  css2DRenderer.domElement.style.display = 'none'
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

<style lang="less" scoped></style>
