import * as THREE from 'three'

/**
 * 创建小球
 * @param R：小球半径
 * @param position：小球位置
 * @returns
 */
export const useSphere = ({
  R = 5,
  position = new THREE.Vector3(0, 0, 0),
  color = 0xff0000
}: {
  R?: number
  position?: THREE.Vector3
  color?: number
}) => {
  const geometry = new THREE.SphereGeometry(R, 25, 25)
  const material = new THREE.MeshLambertMaterial({
    color: color
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.copy(position)
  return mesh
}
