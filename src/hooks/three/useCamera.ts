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

  /**
   * 初始化正交投影相机
   * @param s 正交投影相机上下两个面之间的距离
   * @param near 近裁截面
   * @param far 远裁截面
   * @param position 相机位置
   * @param lookAt 相机视线
   * @returns
   */
  const initOrthographicCamera = ({
    s = 200,
    near = 1,
    far = 1000,
    position = new THREE.Vector3(0, 0, 0),
    lookAt = new THREE.Vector3(0, 0, 0)
  }: {
    s?: number
    near?: number
    far?: number
    position?: THREE.Vector3
    lookAt?: THREE.Vector3
  }) => {
    const k = window.innerWidth / window.innerHeight
    const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, near, far)
    // 设置相机的位置
    camera.position.copy(position)
    // 设置相机的朝向
    camera.lookAt(lookAt)

    return camera
  }

  return {
    initPerspectiveCamera,
    initOrthographicCamera
  }
}
