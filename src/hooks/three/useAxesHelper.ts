import * as THREE from 'three'

/**
 * 创建坐标辅助器
 * @param param0
 */
export const useAxesHelper = ({
  size = 50,
  position = new THREE.Vector3(0, 0, 0),
  scene
}: {
  size?: number
  position?: THREE.Vector3
  scene: THREE.Scene
}) => {
  const axesHelper = new THREE.AxesHelper(size)
  // 设置位置
  axesHelper.position.copy(position)
  scene.add(axesHelper)

  return axesHelper
}
