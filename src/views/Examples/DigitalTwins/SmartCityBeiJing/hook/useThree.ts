import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useLights,
  useCamera,
  useStatus,
  useRenderer,
  useControls,
  useAxesHelper,
  useFog
} from '@/hooks'
// 导入常量
import { cameraPos } from '../constants'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initAmbientLight, initDirectionalLight } = useLights()
  const { initPerspectiveCamera } = useCamera()
  const { initControls } = useControls()
  const { initFog } = useFog()

  // 1.1.创建场景
  const scene = useScene()
  // 设置背景纹理
  // initFog({
  //   color: 0x001111,
  //   near: 10000,
  //   far: 20000,
  //   scene
  // })
  scene.background = new THREE.Color(0x001111)
  // 箭头辅助器
  useAxesHelper({
    size: 200,
    scene: scene
  })
  // 1.4.设置光源
  // 平行光1
  initDirectionalLight({
    position: new THREE.Vector3(200, 400, 300),
    density: 0.8,
    scene,
    name: 'directionalLight1'
  })
  initDirectionalLight({
    position: new THREE.Vector3(-200, -400, 300),
    density: 0.8,
    scene,
    name: 'directionalLight2'
  })
  initAmbientLight({ scene, density: 0.3 })
  // 1.5.创建相机
  const x = 12953728.5
  const y = 4851891.5
  const camera = initPerspectiveCamera({
    position: cameraPos,
    lookAt: new THREE.Vector3(x, y, 0),
    near: 1,
    far: 300000
  })
  // 1.6.创建渲染器
  const renderer = useRenderer(canvas)
  // 1.7.初始化性能监视器
  const status = useStatus()
  // 1.8.初始化相机控件
  const controls = initControls({ camera, renderer })
  controls.target.set(x, y, 0)
  controls.update()
  // 开启缓动动画
  controls.enableDamping = true
  controls.enablePan = false
  // controls.enableRotate = false
  controls.enableZoom = true
  controls.minPolarAngle = Math.PI / 2
  controls.maxPolarAngle = THREE.MathUtils.degToRad(160)
  // 水平旋转最大最小值
  controls.minAzimuthAngle = -Math.PI / 4
  controls.maxAzimuthAngle = Math.PI / 4

  return {
    scene,
    camera,
    renderer,
    controls,
    status
  }
}
