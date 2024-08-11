<template>
  <div class="tomb-raider">
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
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  useProgress,
  useGLTFModel,
  useVehicle,
  useGameEntity,
  usePointer,
  useRayCaster,
  useNavMesh
} from '@/hooks'
import { useThree } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
// 导入YUKA
import * as YUKA from 'yuka'
// 镜面反射
import { Reflector } from './Reflector.js'

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
// 偏移数组
const offsets = [
  new YUKA.Vector3(0, 0, 1),
  new YUKA.Vector3(-1, 0, 1),
  new YUKA.Vector3(1, 0, 1),
  new YUKA.Vector3(3, 0, -3),
  new YUKA.Vector3(-3, 0, -3)
]

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  status: Status, // 性能监视器
  model: THREE.Group, // 网格模型
  controls: OrbitControls,
  city: any, // 城市模型
  car: any, // 警车模型
  ambulance: any, // 救护车
  vihicle: any,
  vihicle2: any,
  target: any, // 游戏实体
  entityManager: any, // 实体管理
  plane: any, // 地面
  navMesh: any //导航网格

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

  // 0.创建实体管理对象
  entityManager = new YUKA.EntityManager()
  // 1.加载城市模型
  await initCityModel()
  // 加载镜面几何体
  await initMirrorGround()
  // 2.加载导航网格
  await initCityPlane()
  navMesh = await useNavMesh({ path: './models/city/citymap.gltf' })
  // 3.加载卡车模型
  await initTrunkModel()
  // 3.加载警车模型
  await initCarModel()
  // 4.搜索目标前进
  const sphere = createSphere()
  model.add(sphere)
  // 5.创建目标：游戏实体
  target = useGameEntity({
    renderComponent: sphere,
    position: new THREE.Vector3(
      Math.random() * 20 - 10,
      0,
      Math.random() * 20 - 10
    )
  })
  // 6.创建障碍物
  // const obstacle = createObstacles()
  // 创建避障行为
  // const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior([
  //   obstacle
  // ])
  // vihicle.steering.add(obstacleAvoidanceBehavior)
  // vihicle2.steering.add(obstacleAvoidanceBehavior)
  // vihicle.smoother = new YUKA.Smoother(20)
  // vihicle2.smoother = new YUKA.Smoother(20)

  entityManager.add(target)
  // entityManager.add(obstacle)
}

// 加载场景模型
const initCityModel = async () => {
  const gltf = (await useGLTFModel({
    path: './models/city/city.glb'
  })) as any
  city = gltf.scene
  model.add(city)
}

// 加载镜面几何体
const initMirrorGround = () => {
  const mirrorGeometry = new THREE.PlaneGeometry(200, 100)
  const groundMirror = new Reflector(mirrorGeometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777
  })
  groundMirror.position.y = 0.1
  groundMirror.rotateX(-Math.PI / 2)
  model.add(groundMirror)
}

// 加载地面
const initCityPlane = async () => {
  const gltf = (await useGLTFModel({
    path: './models/city/citymap.gltf'
  })) as any
  plane = gltf.scene
  model.add(plane)
}

// 加载警车模型
const initCarModel = async () => {
  const gltf = (await useGLTFModel({
    path: './models/cars/警车_Z.glb'
  })) as any
  car = gltf.scene
  car.scale.set(0.2, 0.2, 0.2)

  // 批量创建小车
  for (let i = 0; i < offsets.length; i++) {
    const carObj = car.clone()
    model.add(carObj)
    vihicle = useVehicle({
      renderComponent: carObj,
      speed: 3
    })
    vihicle.position.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5)
    entityManager.add(vihicle)
    // 偏移跟随行为
    const offsetPursuitBehavior = new YUKA.OffsetPursuitBehavior(
      vihicle2,
      offsets[i]
    )
    vihicle.steering.add(offsetPursuitBehavior)
  }
}

// 加载救护车模型
const initTrunkModel = async () => {
  const gltf = (await useGLTFModel({
    path: './models/cars/救护车_Z.glb'
  })) as any
  ambulance = gltf.scene
  ambulance.scale.set(0.2, 0.2, 0.2)
  model.add(ambulance)
  // 创建vihicle
  vihicle2 = useVehicle({
    renderComponent: ambulance,
    speed: 8
  })
  vihicle2.position.set(Math.random() * 5 - 2, 0, Math.random() * 5 - 2)
  entityManager.add(vihicle2)
}

// 创建小球
const createSphere = () => {
  // 创建目标小球
  const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32)
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  return sphere
}

// 创建障碍物
// const createObstacles = () => {
//   const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
//   const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
//   const box = new THREE.Mesh(boxGeometry, boxMaterial)
//   box.position.set(Math.random() * 10 - 5, 0, Math.random() * 10 - 5)
//   model.add(box)

//   // 创建障碍物实体
//   const obstacle = new YUKA.GameEntity()
//   // 设置障碍物的位置
//   obstacle.position.copy(box.position)
//   // 计算box的包围盒
//   boxGeometry.computeBoundingSphere()
//   // 设置障碍物的半径
//   obstacle.boundingRadius = boxGeometry.boundingSphere?.radius

//   return obstacle
// }

// 鼠标点击事件
const handleMouseDown = (event: any) => {
  // 转换坐标为屏幕坐标
  const { x, y } = usePointer(event)
  const choose = useRayCaster({
    x,
    y,
    camera,
    chooseObjArr: plane.children
  })
  if (choose) {
    const point = choose.point
    // 修改小球的位置
    target.position.set(point.x, 0, point.z)
    // 根据导航网格获取路径
    const from = vihicle2.position
    const to = point
    const pathArr = navMesh.findPath(from, to)
    // 创建轨迹路线
    const path = new YUKA.Path()
    for (let item of pathArr) {
      path.add(new YUKA.Vector3(item.x, item.y, item.z))
    }
    vihicle2.steering.clear()
    // 路径行为
    const onPathBehavior = new YUKA.OnPathBehavior(path, 0.1, 0.1)
    onPathBehavior.weight = 10
    vihicle2.steering.add(onPathBehavior)

    // 到达行为
    const arriveBehavior = new YUKA.ArriveBehavior(to, 3, 0.1)
    arriveBehavior.weight = 1
    vihicle2.steering.add(arriveBehavior)
  }
}

// 渲染
const time = new YUKA.Time()
const animate = () => {
  const delta = time.update().getDelta()
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机控件
  controls && controls.update()
  // 更新实体
  entityManager && entityManager.update(delta)
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

onMounted(async () => {
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
  // 监听鼠标点击事件
  window.addEventListener('mousedown', handleMouseDown)
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
  // 移除鼠标点击事件
  window.removeEventListener('mousedown', handleMouseDown)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
