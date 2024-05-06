import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useFog,
  usePanorama,
  useAxesHelper,
  useLights,
  useCamera,
  useStatus,
  useRenderer,
  useCSS2DRenderer,
  useControls,
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
  // 1.2.箭头辅助器
  useAxesHelper({ size: 120, scene: scene })
  // 1.3.通过球体设置天空盒
  usePanorama({
    radius: 1200,
    path: './images/env/1.png',
    scene
  })
  // 1.4.设置环境贴图
  const texture = useEnvironmentTexture({ path: './环境贴图/环境贴图5/' })
  scene.environment = texture
  // 1.5.设置光源
  initAmbientLight({ scene, density: 0.4 })
  initDirectionalLight({
    scene,
    density: 2.9,
    position: new THREE.Vector3(-125, 150, 75),
    isCastShadow: true,
    castShadowCameraConfig: {
      near: 0.5,
      far: 500,
      left: -300,
      right: 300,
      top: 300,
      bottom: -300
    }
  })
  // 1.6.设置雾化效果
  initFog({ scene, near: 900, far: 1600 })
  // 1.7.创建相机
  const camera = initPerspectiveCamera({
    fov: 45,
    position: cameraPos,
    lookAt: cameraTarget,
    far: 8000
  })
  // 1.8.创建渲染器
  const renderer = useRenderer(canvas)
  renderer.shadowMap.enabled = true // 设置渲染器，允许场景中使用阴影贴图
  renderer.shadowMap.type = THREE.VSMShadowMap // 以免模型表面产生条纹影响渲染效果
  // renderer.physicallyCorrectLights = true // 物理校正光照计算
  // 1.9.初始化性能监视器
  const status = useStatus()
  // 1.10.初始化相机控件
  const controls = initControls({ camera, renderer })
  // 开启缓动动画
  controls.enableDamping = true
  controls.enablePan = false
  controls.enableZoom = true
  // 设置最大最小移动距离
  controls.maxDistance = 1000
  controls.minDistance = 100
  // 设置旋转
  controls.maxPolarAngle = THREE.MathUtils.degToRad(89)
  // 1.11.创建css2D渲染器
  const css2DRenderer = useCSS2DRenderer()

  return {
    scene,
    camera,
    renderer,
    controls,
    status,
    css2DRenderer
  }
}
