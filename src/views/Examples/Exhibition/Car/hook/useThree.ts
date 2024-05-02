import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useFog,
  useLights,
  useCamera,
  useStatus,
  useRenderer,
  useControls,
  useAxesHelper,
  useEnvironmentTexture
} from '@/hooks'
// 导入常量
import { cameraPos, cameraTarget } from '../constants'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initFog } = useFog()
  const { initAmbientLight, initDirectionalLight } = useLights()
  const { initPerspectiveCamera } = useCamera()
  const { initControls } = useControls()

  // 1.1.创建场景
  const scene = useScene()
  // 箭头辅助器
  useAxesHelper({ size: 120, scene: scene })
  // 1.2.雾化效果
  initFog({
    near: 1200,
    far: 3500,
    scene
  })
  // 1.3.设置环境贴图
  const textureCube = useEnvironmentTexture({ path: './环境贴图/环境贴图1/' })
  textureCube.encoding = THREE.sRGBEncoding
  scene.environment = textureCube
  scene.background = new THREE.Color(0x000000)
  // 1.4.设置光源
  initAmbientLight({ scene, density: 0.9 })
  initDirectionalLight({
    scene,
    density: 0.8,
    position: new THREE.Vector3(100, 75, 30),
    name: '平行光右'
  })
  initDirectionalLight({
    scene,
    density: 0.8,
    position: new THREE.Vector3(-100, -75, -30),
    name: '平行光左'
  })
  // 1.5.创建相机
  const camera = initPerspectiveCamera({
    fov: 30,
    position: cameraPos,
    lookAt: cameraTarget
  })
  // 1.6.创建渲染器
  const renderer = useRenderer(canvas)
  // 1.7.初始化性能监视器
  const status = useStatus()
  // 1.8.初始化相机控件
  const controls = initControls({ camera, renderer })
  // 开启缓动动画
  controls.enableDamping = true
  controls.enablePan = false
  controls.enableZoom = true
  // 相机距离观察目标点极小距离——模型最大状态
  controls.minDistance = 500
  // 相机距离观察目标点极大距离——模型最小状态
  controls.maxDistance = 800
  // 上下旋转最大值设置
  controls.maxPolarAngle = (Math.PI / 2) * 0.9

  return {
    scene,
    camera,
    renderer,
    controls,
    status,
    textureCube
  }
}
