import * as THREE from 'three'
// 导入hooks
import {
  useScene,
  usePanorama,
  useFog,
  useLights,
  useEnvironmentTexture,
  useCamera,
  useStatus,
  useRenderer,
  useControls
} from '@/hooks'

export const useThree = () => {
  const { initFog } = useFog()
  const { initAmbientLight, initDirectionalLight } = useLights()
  const { initPerspectiveCamera } = useCamera()
  const { initControls } = useControls()

  // 相机的位置坐标
  const cameraPos = new THREE.Vector3(202, 123, 125)
  // 相机的朝向
  const controlsTarget = new THREE.Vector3(0, 0, 0)

  const initThree = (canvas: HTMLCanvasElement) => {
    // 2.1.创建场景
    const scene = useScene()
    initFog({
      near: -100,
      far: 2000,
      scene
    })
    // 2.2.设置天空盒
    usePanorama({ scene, path: './images/全景2048.jpg' })
    // 2.3.设置环境贴图
    const textureCube = useEnvironmentTexture({ path: './环境贴图/环境贴图1/' })
    // 2.4.设置光源
    initAmbientLight({ scene })
    initDirectionalLight({
      scene,
      isShowHelper: true,
      position: new THREE.Vector3(50, 50, 50)
    })
    // 2.6.创建相机
    const camera = initPerspectiveCamera({
      position: new THREE.Vector3(31.68, 12.51, 79.55)
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
    controls.maxDistance = 200
    controls.minDistance = 50
    // 最大仰角
    controls.minPolarAngle = 0
    controls.maxPolarAngle = THREE.MathUtils.degToRad(89)

    return {
      scene,
      camera,
      renderer,
      controls,
      status,
      cameraPos,
      controlsTarget,
      textureCube
    }
  }

  return {
    initThree
  }
}
