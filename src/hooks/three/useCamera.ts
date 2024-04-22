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
  const initPerspectiveCamera = ({
    fov = 30,
    near = 1,
    far = 3000,
    position = new THREE.Vector3(0, 0, 0),
    lookAt = new THREE.Vector3(0, 0, 0)
  }: {
    fov?: number
    near?: number
    far?: number
    position?: THREE.Vector3
    lookAt?: THREE.Vector3
  }) => {
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
