import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useFog,
  useLights,
  useCamera,
  useStatus,
  useRenderer,
  useCSS2DRenderer,
  useControls,
  useAxesHelper,
  useEnvironmentTexture,
  useGUI
} from '@/hooks'
// 导入常量
import { cameraPos, cameraTarget } from '../constants'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initAmbientLight, initDirectionalLight } = useLights()
  const { initPerspectiveCamera } = useCamera()
  const { initControls } = useControls()

  // 1.1.创建场景
  const scene = useScene()
  scene.background = new THREE.Color(0x000000)
  // 箭头辅助器
  // useAxesHelper({ size: 120, scene: scene })
  // 1.3.设置天空盒
  const textureCube = useEnvironmentTexture({ path: './环境贴图/环境贴图2/' })
  // 1.4.设置光源
  initAmbientLight({ scene, density: 1.9 })
  initDirectionalLight({
    scene,
    density: 0.8,
    position: new THREE.Vector3(100, 75, 30)
  })
  initDirectionalLight({
    scene,
    density: 0.8,
    position: new THREE.Vector3(-100, -75, -30)
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
  // 1.9.创建GUI对象
  const gui = useGUI()
  // 1.10.创建css2D渲染器
  const css2DRenderer = useCSS2DRenderer()

  return {
    scene,
    camera,
    renderer,
    controls,
    status,
    textureCube,
    gui,
    css2DRenderer
  }
}
