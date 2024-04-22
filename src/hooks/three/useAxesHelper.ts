import * as THREE from 'three'

/**
 * 创建坐标辅助器
 * @param param0
 */
export const useAxesHelper = ({
  size = 50,
  scene
}: {
  size?: number
  scene: THREE.Scene
}) => {
  const axesHelper = new THREE.AxesHelper(size)
  scene.add(axesHelper)
}
