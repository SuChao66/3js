// 导入THREE
import * as THREE from 'three'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const useControls = () => {
  /**
   * 初始化相机控件
   * @param camera
   * @param renderer
   */
  const initControls = ({
    camera,
    renderer
  }: {
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    renderer: THREE.WebGLRenderer
  }) => {
    const controls = new OrbitControls(camera!, renderer!.domElement)
    controls.target.set(0, 0, 0)

    return controls
  }

  return {
    initControls
  }
}
