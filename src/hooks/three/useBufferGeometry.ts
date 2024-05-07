import * as THREE from 'three'

/**
 * 根据顶点坐标创建缓冲几何体
 * @param pointArr
 * @returns
 */
export const useBufferGeometry = (pointArr: number[]) => {
  // 1.创建缓冲几何体
  const geometry = new THREE.BufferGeometry()
  // 2.将顶点坐标转换为类型化数组
  const vertices = new Float32Array(pointArr)
  // 3.创建属性缓冲区对象，3个为一组，表示一个顶点的xyz坐标
  const positionsAttibute = new THREE.BufferAttribute(vertices, 3)
  // 4.设置缓冲几何体的attributes属性的位置属性
  geometry.attributes.position = positionsAttibute

  return geometry
}
