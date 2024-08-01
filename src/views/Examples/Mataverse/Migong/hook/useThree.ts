import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  useCamera,
  useStatus,
  useRenderer,
  useHdr,
  useLights
  // useAxesHelper
} from '@/hooks'
// 导入常量
import { cameraPos, cameraTarget } from '../constants'

export const useThree = (canvas: HTMLCanvasElement) => {
  const { initPerspectiveCamera } = useCamera()
  const { initAmbientLight, initDirectionalLight } = useLights()

  // 1.1.创建场景
  const scene = useScene()
  // 1.2.设置背景
  useHdr({
    path: './hdr/sky1.hdr',
    scene
  })
  // 1.3.添加光照
  initAmbientLight({ scene, density: 1 })
  initDirectionalLight({
    position: new THREE.Vector3(100, 40, 100),
    scene,
    name: '平行光1'
  })
  initDirectionalLight({
    position: new THREE.Vector3(-100, 40, -100),
    scene,
    name: '平行光2'
  })
  // 1.4.辅助器
  // useAxesHelper({
  //   scene,
  //   size: 100
  // })
  // 1.5.创建相机
  const camera = initPerspectiveCamera({
    fov: 45,
    position: cameraPos,
    lookAt: cameraTarget,
    near: 0.1,
    far: 1000
  })
  // 1.6.创建渲染器
  const renderer = useRenderer(canvas)
  renderer.physicallyCorrectLights = true
  // 色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  // 色调映射的曝光级别
  renderer.toneMappingExposure = 2
  // 1.7.初始化性能监视器
  const status = useStatus()

  return {
    scene,
    camera,
    renderer,
    status
  }
}
