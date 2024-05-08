import * as THREE from 'three'
// 导入hook
import { useBufferGeometry } from './useBufferGeometry'

/**
 * 根据顶点坐标，生成点模型
 * @param pointsArr
 * @param lineType
 * @param color
 * @returns
 */
export const usePoints = ({
  pointsArr,
  colorsArr,
  color = new THREE.Color(0xffff00),
  size = 1.0,
  isVertexColors = false
}: {
  pointsArr: number[]
  colorsArr?: number[]
  color?: THREE.Color
  size?: number
  isVertexColors?: boolean // 是否采用顶点着色（颜色插值）
}) => {
  const geometry = useBufferGeometry({
    pointsArr: pointsArr,
    colorsArr: colorsArr,
    isVertexColors: isVertexColors
  })
  const material = new THREE.PointsMaterial({
    size: size
  })
  // 是否采用顶点颜色插值
  if (isVertexColors) {
    material.vertexColors = isVertexColors
  } else {
    material.color = color
  }
  const point = new THREE.Points(geometry, material)

  return point
}
