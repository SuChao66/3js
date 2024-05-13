import * as THREE from 'three'

/**
 * 创建地球
 * @param R 小球半径
 * @returns
 */
export const useEarthSphere = ({
  R,
  color = 0x000909,
  transparent = false,
  opacity = 0.3
}: {
  R: number
  color?: number
  transparent?: boolean
  opacity?: number
}) => {
  const geometry = new THREE.SphereGeometry(R, 40, 40)
  const material = new THREE.MeshLambertMaterial({
    color: color,
    transparent: transparent,
    opacity: opacity
  })
  const mesh = new THREE.Mesh(geometry, material)

  return mesh
}
