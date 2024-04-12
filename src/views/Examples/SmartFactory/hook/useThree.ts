// 导入hooks
import { useScene } from '@/hooks/useScene'
import { useAxesHelper } from '@/hooks/useAxesHelper'
import { useHdr } from '@/hooks/useHdr'
import { useFog } from '@/hooks/useFog'
import { useLights } from '@/hooks/useLights'
import { useCamera } from '@/hooks/useCamera'
import { useStatus } from '@/hooks/useStatus'
import { useRenderer } from '@/hooks/useRenderer'
import { useControls } from '@/hooks/useControls'

export const useThree = () => {
  const { initScene } = useScene()
  const { initHelper } = useAxesHelper()
  const { initHDR } = useHdr()
  const { initFogExp2 } = useFog()
  const { initAmbientLight, initDirectionalLight } = useLights()
  const { initPerspectiveCamera } = useCamera()
  const { initStatus } = useStatus()
  const { initRender } = useRenderer()
  const { initControls } = useControls()

  const initThree = (canvas: HTMLCanvasElement) => {
    // 2.1.创建场景
    const scene = initScene()
    // 2.2.辅助观察坐标系
    const axesHelper = initHelper()
    scene.add(axesHelper)
    // 2.3.设置天空盒
    initHDR('./hdr/sky1.hdr').then((texture: any) => {
      scene.background = texture
      scene.environment = texture
    })
    // 2.4.创建雾化效果
    const fog = initFogExp2()
    scene.fog = fog
    // 2.5.设置光源
    const ambient = initAmbientLight()
    scene.add(ambient)
    const directionalLight = initDirectionalLight()
    scene.add(directionalLight)
    // 2.6.创建相机
    const camera = initPerspectiveCamera()
    // 2.7.创建渲染器
    const renderer = initRender(canvas)
    // 2.8.初始化性能监视器
    const status = initStatus()
    // 2.9.初始化相机控件
    const controls = initControls(camera, renderer)
    // 开启缓动动画
    controls.enableDamping = true
    controls.enablePan = false
    controls.enableZoom = true
    // 内外移动距离
    controls.maxDistance = 400
    controls.minDistance = 100
    // 最大仰角
    controls.minPolarAngle = 0
    controls.maxPolarAngle = Math.PI / 2

    return { scene, camera, renderer, controls, status }
  }

  return {
    initThree
  }
}
