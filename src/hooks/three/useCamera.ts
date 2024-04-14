import * as THREE from 'three'

export const useCamera = () => {
  /**
   * 初始化透视投影相机
   * @param fov
   * @param near
   * @param far
   * @param position
   * @param lookAt
   */
  const initPerspectiveCamera = (
    fov: number = 30,
    near: number = 1,
    far: number = 3000,
    position: THREE.Vector3 = new THREE.Vector3(202, 123, 125),
    lookAt: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  ) => {
    const width = window.innerWidth
    const height = window.innerHeight
    const camera = new THREE.PerspectiveCamera(fov, width / height, near, far)
    // 设置相机的位置
    camera.position.copy(position)
    // 设置相机的朝向
    camera.lookAt(lookAt)

    return camera
  }

  return {
    initPerspectiveCamera
  }
}
