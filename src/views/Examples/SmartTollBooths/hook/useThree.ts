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
  useCSS3DRenderer,
  useControls,
  useHdr
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
  // 1.2.添加雾化效果
  initFog({
    near: -100,
    far: 2000,
    scene
  })
  // 1.3.设置天空盒
  useHdr({ path: './hdr/sky2.hdr', scene })
  // 1.4.设置光源
  initAmbientLight({ scene })
  initDirectionalLight({
    scene,
    density: 0.9,
    position: new THREE.Vector3(100, 100, 100)
  })
  // 1.5.创建相机
  const camera = initPerspectiveCamera({
    fov: 45,
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
  // 内外移动距离
  controls.maxDistance = 50
  controls.minDistance = 20
  // 最大仰角
  controls.minPolarAngle = 0
  controls.maxPolarAngle = THREE.MathUtils.degToRad(89)
  // 设置相机控制器的目标指向点
  controls.target.copy(cameraTarget)
  controls.update()
  // 1.9.创建css3d渲染器
  const css3Drenderer = useCSS3DRenderer()
  // 2.0.创建css2d渲染器
  const css2Drenderer = useCSS2DRenderer()

  return {
    scene,
    camera,
    renderer,
    css3Drenderer,
    css2Drenderer,
    controls,
    status
  }
}
