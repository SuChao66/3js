import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useLights,
  useCamera,
  useStatus,
  useRenderer,
  useControls,
  // useAxesHelper,
  useCSS2DRenderer,
  useTexture
} from '@/hooks'
// 导入常量
import { cameraPos, cameraTarget, s } from '../constants'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initAmbientLight, initDirectionalLight } = useLights()
  const { initOrthographicCamera } = useCamera()
  const { initControls } = useControls()

  // 1.1.创建场景
  const scene = useScene()
  // 设置背景纹理
  const texture = useTexture({
    path: './images/bg/bg3.png'
  })
  scene.background = texture
  // 箭头辅助器
  // useAxesHelper({ size: 200, scene: scene })
  // 1.4.设置光源
  initAmbientLight({ scene, density: 0.6 })
  initDirectionalLight({
    scene,
    density: 0.6,
    position: new THREE.Vector3(400, 200, 300),
    name: '平行光1'
  })
  initDirectionalLight({
    scene,
    density: 0.6,
    position: new THREE.Vector3(-400, -200, -300),
    name: '平行光2'
  })
  // 1.5.创建相机
  const camera = initOrthographicCamera({
    s: s,
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
  // 1.9.css2Drenderer渲染器
  const css2Renderer = useCSS2DRenderer()

  return {
    scene,
    camera,
    renderer,
    controls,
    status,
    css2Renderer
  }
}
