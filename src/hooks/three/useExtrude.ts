import * as THREE from 'three'

/**
 * 生成shape拉伸几何体
 * @param shapes
 */
export const useExtrude = ({
  shapes,
  color = 0x004444,
  height = 2.0
}: {
  shapes: any[]
  color?: number
  height?: number
}) => {
  // 1.创建材质
  const materail = new THREE.MeshLambertMaterial({
    color: color,
    side: THREE.DoubleSide
  })
  // 2.创建几何体
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: height,
    bevelEnabled: false // 无倒脚
  })
  // 3.创建网格模型
  const mesh = new THREE.Mesh(geometry, materail)

  return mesh
}
