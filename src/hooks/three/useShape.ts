import * as THREE from 'three'

/**
 * 生成shape填充几何体
 * @param shapes
 */
export const useShape = ({
  shapes,
  color = 0x004444
}: {
  shapes: any[]
  color?: number
}) => {
  // 1.创建材质
  const materail = new THREE.MeshBasicMaterial({
    color: color,
    side: THREE.DoubleSide
  })
  // 2.创建几何体
  const geometry = new THREE.ShapeGeometry(shapes)
  // 3.创建网格模型
  const mesh = new THREE.Mesh(geometry, materail)

  return mesh
}
