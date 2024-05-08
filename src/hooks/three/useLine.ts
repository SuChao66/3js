import * as THREE from 'three'
// 导入hook
import { useBufferGeometry } from './useBufferGeometry'
// 导入常量
import { LineType } from '@/enums'

/**
 * 根据顶点坐标，生成线模型
 * @param pointsArr
 * @param colorsArr
 * @param lineType
 * @param color
 * @param isVertexColors
 * @returns
 */
export const useLine = ({
  pointsArr,
  colorsArr,
  lineType,
  color = new THREE.Color(0x00ffff),
  isVertexColors = false
}: {
  pointsArr: any[]
  colorsArr?: number[]
  lineType: LineType
  color?: THREE.Color
  isVertexColors?: boolean // 是否采用顶点着色（颜色插值）
}) => {
  const geometry = useBufferGeometry({
    pointsArr: pointsArr,
    colorsArr: colorsArr,
    isVertexColors: isVertexColors
  })
  const material = new THREE.LineBasicMaterial()
  // 是否采用顶点颜色插值
  if (isVertexColors) {
    material.vertexColors = isVertexColors
  } else {
    material.color = color
  }
  let line
  if (lineType === LineType.Line) {
    line = new THREE.Line(geometry, material)
  } else if (lineType === LineType.LineLoop) {
    line = new THREE.LineLoop(geometry, material)
  } else {
    line = new THREE.LineSegments(geometry, material)
  }
  return line
}
