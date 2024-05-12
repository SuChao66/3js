import * as THREE from 'three'

/**
 * 创建地球
 * @param R 小球半径
 * @returns
 */
export const useEarthSphere = ({
  R,
  color = 0x000909
}: {
  R: number
  color?: number
}) => {
  const geometry = new THREE.SphereGeometry(R, 40, 40)
  const material = new THREE.MeshLambertMaterial({
    color: color
  })
  const mesh = new THREE.Mesh(geometry, material)

  return mesh
}
