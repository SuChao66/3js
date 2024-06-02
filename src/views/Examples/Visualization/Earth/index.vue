<template>
  <div class="earth">
    <!-- 顶部标题 -->
    <SBigScreenHeader v-if="!isLoading" title="全球航班可视化大屏" />
    <!-- 图表 -->
    <SCharts v-if="!isLoading" />
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- 国家标签 -->
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
// CSS2DRenderer
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
// 导入TWEEN
import * as TWEEN from '@tweenjs/tween.js'
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  usePointer,
  useRayCaster,
  useEarthCountry,
  useCSS2DObject,
  useArcFlyPath,
  useLon2xyz
} from '@/hooks'
import {
  useThree,
  // useEarthAirPortsByTexture,
  // useEarthWay,
  useEarthCircle,
  useHotNews,
  // useCountryGDP,
  // useGDPPrism,
  // createPrism,
  // usePopulationDensity,
  usePointMesh,
  useWaveMesh,
  useConeMesh
} from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import SBigScreenHeader from '@/baseui/SBigScreenHeader/index.vue'
import STag from './components/STag/index.vue'
import SCharts from './components/SCharts/index.vue'
// 导入常量
import { s, earthRadius, gdpMax } from './constants'
// 导入数据
import data from './data/data.js'

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
// 波动光圈
let waveMeshArr: THREE.Mesh[] = []
// 飞线
let flyLineArr: any[] = []

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.OrthographicCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  css2Renderer: CSS2DRenderer, // css2D标签渲染器
  status: Status, // 性能监视器
  model: THREE.Group, // 地球网格模型
  earth: any, // 地球模型
  chooseCountry: any, // 当前选中的国家
  label: any, // 国家标签
  chooseGroup: THREE.Group, // 光圈底座
  ConeMesh: THREE.Mesh

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    css2Renderer: mCss2Renderer
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
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
  // 1.创建地球
  model = new THREE.Group()
  scene.add(model)
  earth = await useEarthCountry({
    R: earthRadius,
    path: './data/worldZh.json',
    isZh: true
  })
  model.add(earth)
  // 2.创建地球光圈
  const sprite = useEarthCircle('./images/planets/glow.png')
  model.add(sprite)

  // 3.可视化全球机场
  // const airportsGroup = await useEarthAirPorts('./data/airports.json')
  // model.add(airportsGroup as any)
  // const airportsGroup = await useEarthAirPortsByTexture(
  //   './data/airports_small.json'
  // )
  // model.add(airportsGroup as any)

  // 4.可视化全球公路铁路线
  // const earthWayGroup = await useEarthWay('./data/railway.json')
  // model.add(earthWayGroup as any)

  // 5.标注热点新闻地
  const meshMap = (await useHotNews('./data/hotNews.json')) as any
  chooseGroup = meshMap.chooseGroup
  model.add(meshMap.spriteGroup)

  // 6.根据GDP显示国家颜色，并创建GDP光柱效果
  // const countryGdpColor = (await useCountryGDP('./data/gdp.json')) as any
  // const capitalObj = (await useGDPPrism('./data/首都经纬度.json')) as any
  // earth.countryMeshs.forEach((mesh: any) => {
  //   if (countryGdpColor[mesh.name]) {
  //     mesh.material.color.copy(countryGdpColor[mesh.name].color)
  //     mesh.color = countryGdpColor[mesh.name].color
  //     mesh.gdp = countryGdpColor[mesh.name].gdp
  //     // 创建GPD光柱效果
  //     if (mesh.gdp > gdpMax / 100) {
  //       const countryGdpPrism = createPrism(
  //         earthRadius,
  //         capitalObj[mesh.name][0],
  //         capitalObj[mesh.name][1],
  //         mesh.gdp / 100000000000,
  //         mesh.color
  //       )
  //       model.add(countryGdpPrism)
  //     }
  //   } else {
  //     mesh.material.color.set(0xffffff)
  //     mesh.color = mesh.material.color.clone()
  //   }
  // })

  // 7.初始化人口密度
  // const group = (await usePopulationDensity(
  //   './data/population_density.json'
  // )) as any
  // model.add(group)

  // 8.绘制飞线
  const flyPathGroup = new THREE.Group()
  const start = data.start
  // 转化开始点坐标为球面坐标
  const { x, y, z } = useLon2xyz(earthRadius, start.E, start.N)
  const startPoint = new THREE.Vector3(x, y, z)
  // 静态圆点平面
  const startMesh = usePointMesh(earthRadius, start.E, start.N)
  flyPathGroup.add(startMesh)
  // 波动光圈
  const startWaveMesh = useWaveMesh(earthRadius, start.E, start.N)
  flyPathGroup.add(startWaveMesh)
  waveMeshArr.push(startWaveMesh)
  // 创建棱柱，标注起点
  ConeMesh = useConeMesh(earthRadius, start.E, start.N)
  flyPathGroup.add(ConeMesh)
  data.endArr.forEach((cood: any) => {
    const { x, y, z } = useLon2xyz(earthRadius, cood.E, cood.N)
    // 静态圆点平面
    const endMesh = usePointMesh(earthRadius, cood.E, cood.N)
    flyPathGroup.add(endMesh)
    // 波动光圈
    const endWaveMesh = useWaveMesh(earthRadius, cood.E, cood.N)
    flyPathGroup.add(endWaveMesh)
    waveMeshArr.push(endWaveMesh)
    // 绘制飞线
    const endPoint = new THREE.Vector3(x, y, z)
    const { line } = useArcFlyPath({
      R: earthRadius,
      startPoint,
      endPoint,
      model
    })
    flyPathGroup.add(line)
    flyLineArr.push(line.flyLine)
  })
  model.add(flyPathGroup)
  // 结束loading
  isLoading.value = false
}

// 初始化标签
const initLabel = () => {
  const dom = document.getElementById('country') as HTMLDivElement
  label = useCSS2DObject({ dom })
}

// 鼠标点击事件，射线拾取
const handlePointClick = (e: Event) => {
  // 1.转换坐标
  const { x, y } = usePointer(e)
  // 2.射线拾取新闻热点
  const chooseObj = useRayCaster({
    x,
    y,
    camera,
    chooseObjArr: chooseGroup.children
  }) as any
  if (chooseObj) {
    window.open(chooseObj.href)
  }
}

// 鼠标移动事件
const handleMouseMove = (e: Event) => {
  // 1.转换坐标
  const { x, y } = usePointer(e)
  // 2.射线拾取
  if (chooseCountry) {
    if (chooseCountry.gdp) {
      chooseCountry.material.color.set(chooseCountry.color)
    } else {
      chooseCountry.material.color.set(0x002222)
    }
    chooseCountry.remove(label)
  }
  chooseCountry = useRayCaster({
    x,
    y,
    camera,
    chooseObjArr: earth.countryMeshs
  })
  if (chooseCountry) {
    chooseCountry.material.color.set(0x00ccccc)
    // 将标签添加至网格模型中
    chooseCountry.add(label)
    // 修改标签的文案
    if (chooseCountry.gdp) {
      label.element.innerHTML = `${chooseCountry.name}, GDP: ${(chooseCountry.gdp / 1000000000000).toFixed(3)}万亿美元`
    } else {
      label.element.innerHTML = `${chooseCountry.name}, GDP: 缺失数据`
    }
    // 设置标签的位置
    label.position.copy(chooseCountry.point)
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
  // 更新动画时间
  TWEEN.update()
  // 旋转模型
  if (!chooseCountry) {
    model && model.rotateY(0.0015)
  }
  // 动态更新飞线的角度
  flyLineArr.forEach((flyLine) => {
    flyLine.rotation.z += 0.02
    if (flyLine.rotation.z >= flyLine.flyEndAngle) {
      flyLine.rotation.z = flyLine.startAngle
    }
  })
  // 波动光圈动画
  if (waveMeshArr.length) {
    waveMeshArr.forEach((mesh: any) => {
      mesh._s += 0.007
      mesh.scale.set(
        mesh.size * mesh._s,
        mesh.size * mesh._s,
        mesh.size * mesh._s
      )
      if (mesh._s <= 1.5) {
        mesh.material.opacity = (mesh._s - 1) * 2
      } else if (mesh._s > 1.5 && mesh._s <= 2) {
        mesh.material.opacity = 1 - (mesh._s - 1.5) * 2
      } else {
        mesh._s = 1.0
      }
    })
  }
  // 棱锥转动
  if (ConeMesh) {
    ConeMesh.rotateZ(-0.02)
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
  // 重新设置css2DRenderer
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

onMounted(() => {
  // 初始化
  init()
  // 加载模型
  initModel()
  // 播放动画
  animate()
  // 创建标签
  initLabel()
  // 监听点击事件
  renderer.domElement.addEventListener('click', handlePointClick)
  // 监听鼠标移动事件
  renderer.domElement.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
  // 移除点击事件
  renderer.domElement.removeEventListener('click', handlePointClick)
  // 移除鼠标移动事件
  renderer.domElement.addEventListener('mousemove', handleMouseMove)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
