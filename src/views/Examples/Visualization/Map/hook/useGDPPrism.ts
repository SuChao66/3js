import * as THREE from 'three'

const geometry = new THREE.CylinderGeometry(1, 1, 1, 6)
geometry.computeVertexNormals()
geometry.rotateX(Math.PI / 2)
geometry.translate(0, 0, 0.5)

export const useGDPPrism = (
  x: number,
  y: number,
  size: number,
  height: number,
  color: number
) => {
  const material = new THREE.MeshLambertMaterial({
    color: color
  })
  const mesh = new THREE.Mesh(geometry, material)
  // 设置位置
  mesh.position.set(x, y, size)
  // 设置大小
  mesh.scale.set(size, size, height)

  return mesh
}
