import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useAxesHelper,
  useHdr,
  useFog,
  useLights,
  useCamera,
  useStatus,
  useRenderer,
  useCSS2DRenderer,
  useControls
} from '@/hooks'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initFogExp2 } = useFog()
  const { initAmbientLight, initDirectionalLight } = useLights()
  const { initPerspectiveCamera } = useCamera()
  const { initControls } = useControls()
  // 相机的位置坐标
  const cameraPos = new THREE.Vector3(202, 123, 125)
  // 相机的朝向
  const controlsTarget = new THREE.Vector3(0, 0, 0)

  // 2.1.创建场景
  const scene = useScene()
  // 2.2.辅助观察坐标系
  useAxesHelper({ scene })
  // 2.3.设置天空盒
  useHdr({ path: './hdr/sky1.hdr', scene })
  // 2.4.创建雾化效果
  initFogExp2({ scene })
  // 2.5.设置光源
  initAmbientLight({ scene })
  initDirectionalLight({ scene, position: new THREE.Vector3(100, 60, 50) })
  // 2.6.创建相机
  const camera = initPerspectiveCamera({
    position: new THREE.Vector3(202, 123, 125)
  })
  // 2.7.创建渲染器
  const renderer = useRenderer(canvas)
  // 2.8.初始化性能监视器
  const status = useStatus()
  // 2.9.初始化相机控件
  const controls = initControls({ camera, renderer })
  // 开启缓动动画
  controls.enableDamping = true
  controls.enablePan = false
  controls.enableZoom = true
  // 内外移动距离
  controls.maxDistance = 400
  controls.minDistance = 0
  // 最大仰角
  controls.minPolarAngle = 0
  controls.maxPolarAngle = Math.PI / 2
  // 2.10.创建css2D渲染器
  const css2Renderer = useCSS2DRenderer()

  return {
    scene,
    camera,
    renderer,
    controls,
    status,
    css2Renderer,
    cameraPos,
    controlsTarget
  }
}
