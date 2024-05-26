<template>
  <div class="map">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- 省份标签 -->
    <STag />
    <!-- css2D标签渲染器 -->
    <div ref="css2DRendererRef"></div>
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
// CSS2DRenderer
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
// 导入TWEEN
import * as TWEEN from '@tweenjs/tween.js'
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  useCountryMap,
  useSprite,
  useCSS2DObject,
  usePointer,
  useRayCaster,
  useLon2Mercator,
  useCatmullRomFlyPath
} from '@/hooks'
import {
  useThree,
  useProvince,
  useProvinceCircle,
  useConeMesh,
  useProvinceLabel,
  useGDPPrism,
  useProvinceGDP,
  useWeiBo
} from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import STag from './components/STag/index.vue'
// 导入常量
import { s, mapSize } from './constants'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// css2Drenderer渲染器
const css2DRendererRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.OrthographicCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  css2Renderer: CSS2DRenderer, // css2D标签渲染器
  model: THREE.Group, // 模型集合
  controls: OrbitControls,
  status: Status, // 性能监视器
  provinceMeshGroup: THREE.Group, // 省份地图group
  chooseProvince: any, // 当前选中的省份
  label: any, // 省份GDP标签
  coneMesh: THREE.Mesh // 光柱

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    controls: mControls,
    css2Renderer: mCss2Renderer
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  controls = mControls
  css2Renderer = mCss2Renderer
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加css2Drender
  css2DRendererRef.value?.appendChild(css2Renderer.domElement)
}

// 加载模型
const initModel = async () => {
  // 0. 初始化model
  model = new THREE.Group()
  scene.add(model)
  // 1.世界地图
  // const mapGroup = (await useCountryMap({
  //   path: './data/GeoJSON数据/world.json',
  //   mapSize: mapSize,
  //   height: mapSize * 0.02 // 拉伸高度
  // })) as any
  // model.add(mapGroup)

  // 2.中国地图
  // const mapGroup = (await useCountryMap({
  //   path: './data/GeoJSON数据/china.json',
  //   mapSize: mapSize,
  //   height: mapSize * 0.02
  // })) as any
  // model.add(mapGroup)

  // 3.中国地图-详细
  const { mapGroup, meshGroup } = (await useCountryMap({
    path: './data/GeoJSON数据/其它GeoJSON/china-详细.json',
    mapSize: mapSize,
    height: mapSize * 0.02
  })) as any
  provinceMeshGroup = meshGroup
  // 中国省份行政中心标注
  const provinceGroup = (await useProvince({
    path: './data/GeoJSON数据/其它GeoJSON/china-详细.json',
    mapSize: mapSize
  })) as any
  const provinceCircleGroup = (await useProvinceCircle({
    path: './data/GeoJSON数据/其它GeoJSON/china-详细.json',
    mapSize: mapSize,
    isAnimation: true
  })) as any
  // 四棱柱标注北京
  const pos = [116.405285, 39.904989]
  coneMesh = useConeMesh(mapSize, pos[0], pos[1])
  const sprite = useSprite({
    path: './images/planets/star.png',
    scale: new THREE.Vector3(mapSize * 0.04, mapSize * 0.04, mapSize * 0.05),
    color: new THREE.Color(0xffffff)
  })
  coneMesh.add(sprite)
  // 中国省份行政中心标签标注
  // const provinceLabelGroup = (await useProvinceLabel({
  //   path: './data/GeoJSON数据/其它GeoJSON/china-详细.json',
  //   mapSize: mapSize
  // })) as any
  // 省份GDP
  const provinceGdpColor = (await useProvinceGDP({
    path: './data/GeoJSON数据/省份gdp.json'
  })) as any
  // 获取最大GDP数值
  let gdpArr = []
  for (let key in provinceGdpColor) {
    gdpArr.push(provinceGdpColor[key].gdp)
  }
  gdpArr = gdpArr.sort()
  // const gdpMax = gdpArr[gdpArr.length - 1]
  provinceMeshGroup.traverse((item: any) => {
    if (item.isMesh) {
      if (provinceGdpColor[item.name]) {
        // 设置城市网格模型颜色
        item.material.color.copy(provinceGdpColor[item.name].color)
        item.gdp = provinceGdpColor[item.name].gdp
        item.color = provinceGdpColor[item.name].color
        // GDP可视化
        // const height =
        //   (provinceGdpColor[item.name].gdp / gdpMax) * mapSize * 0.2
        // const { x, y } = useLon2Mercator(item.center[0], item.center[1])
        // const gdpPrism = useGDPPrism(x, y, mapSize * 0.01, height, item.color)
        // item.add(gdpPrism)
      }
    }
  })

  // 微博数据可视化
  // const weiBoPoints = (await useWeiBo({
  //   path: './data/全国微博签到数据.json',
  //   mapSize: mapSize
  // })) as any

  // 飞线设置
  const line = useCatmullRomFlyPath({
    start: [120.153576, 30.287459],
    end: [103.823557, 36.058039],
    isAnimation: true
  })
  line.position.z += mapSize * 0.02
  model.add(line)

  model.add(mapGroup)
  model.add(provinceGroup)
  model.add(provinceCircleGroup)
  model.add(coneMesh)
  // model.add(weiBoPoints)
  // model.add(provinceLabelGroup)

  // 4.河南
  // const mapGroup = (await useCountryMap({
  //   path: './data/GeoJSON数据/河南.json',
  //   mapSize: mapSize,
  //   height: mapSize * 0.02
  // })) as any
  // model.add(mapGroup)

  // 5.郑州
  // const mapGroup = (await useCountryMap({
  //   path: './data/GeoJSON数据/郑州.json',
  //   mapSize: mapSize,
  //   height: mapSize * 0.02
  // })) as any
  // model.add(mapGroup)

  // 创建包围盒
  const box3 = new THREE.Box3()
  box3.expandByObject(mapGroup)
  // 获取包围盒的尺寸
  const scale = new THREE.Vector3()
  box3.getSize(scale)
  console.log('scale范围', scale) // {x: 61.611305236816406, y: 35.463802337646484, z: 1}
  // 获取几何体中心
  const center = new THREE.Vector3()
  box3.getCenter(center)
  console.log('查看几何中心', center) //  {x: 104.28225326538086, y: 35.83740043640137, z: 0.5}
  // 设置相机的位置和lookAt
  camera.lookAt(center.x, center.y, center.z)
  camera.position.set(center.x, center.y, scale.y * 5)
  controls.target.set(center.x, center.y, center.z)
  // 关闭loading
  isLoading.value = false
}

// 鼠标移动事件
const handleMouseMove = (e: Event) => {
  // 1.转换坐标
  const { x, y } = usePointer(e)
  // 2.射线拾取
  if (chooseProvince) {
    if (chooseProvince.gdp) {
      chooseProvince.material.color.set(chooseProvince.color)
    } else {
      chooseProvince.material.color.set(0x002222)
    }
  }
  chooseProvince = useRayCaster({
    x,
    y,
    camera,
    chooseObjArr: provinceMeshGroup.children
  })
  if (chooseProvince) {
    chooseProvince.material.color.set(0x00cccc)
    // 将标签添加至网格模型中
    chooseProvince.add(label)
    // 修改标签的文案
    if (chooseProvince.gdp) {
      label.element.innerHTML = `${chooseProvince.name}, GDP: ${chooseProvince.gdp.toFixed(3)}亿美元`
    } else {
      label.element.innerHTML = `${chooseProvince.name}, GDP: 缺失数据`
    }
    // 设置标签的位置
    label.position.copy(chooseProvince.point)
  }
}

// 渲染
const animate = () => {
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // css2D渲染器渲染
  css2Renderer && css2Renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机空间
  controls.update()
  // 更新动画时间
  TWEEN.update()
  // 选装光柱
  if (coneMesh) {
    coneMesh.rotateZ(0.02)
  }
}

// 监听窗口的变化
const handleResize = (width: number, height: number) => {
  // 计算相机的aspect
  const k = width / height
  if (camera) {
    // 更新相机参数
    camera.left = -s * k
    camera.right = s * k
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

const initLabel = () => {
  const dom = document.getElementById('country') as HTMLDivElement
  label = useCSS2DObject({ dom })
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
  // 初始化label
  initLabel()
  // 监听鼠标移动事件
  renderer.domElement.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
  // 移除鼠标移动事件
  renderer.domElement.addEventListener('mousemove', handleMouseMove)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
