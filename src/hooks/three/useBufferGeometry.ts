import * as THREE from 'three'

/**
 * 根据顶点坐标创建缓冲几何体
 * @param pointArr
 * @param colorArr 颜色插值
 * @param isVertexColors 是否采用颜色插值
 * @returns
 */
export const useBufferGeometry = ({
  pointsArr,
  colorsArr = [],
  isVertexColors = false
}: {
  pointsArr: number[]
  colorsArr?: number[]
  isVertexColors?: boolean
}) => {
  // 1.创建缓冲几何体
  const geometry = new THREE.BufferGeometry()
  // 2.将顶点坐标转换为类型化数组
  const vertices = new Float32Array(pointsArr)
  // 3.创建属性缓冲区对象，3个为一组，表示一个顶点的xyz坐标
  const positionsAttibute = new THREE.BufferAttribute(vertices, 3)
  // 4.设置缓冲几何体的attributes属性的位置属性
  geometry.attributes.position = positionsAttibute
  // 5.判断是否彩英颜色插值算法
  if (isVertexColors) {
    const colors = new Float32Array(colorsArr)
    const colorAttibute = new THREE.BufferAttribute(colors, 3)
    geometry.attributes.color = colorAttibute
  }

  return geometry
}
