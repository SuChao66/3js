import * as THREE from 'three'
// 导入hook
import { useBufferGeometry } from './useBufferGeometry'
// 导入常量
import { LineType } from '@/enums'

/**
 * 根据顶点坐标，生成线模型
 * @param pointsArr
 * @param lineType
 * @param color
 * @returns
 */
export const useLine = ({
  pointsArr,
  lineType,
  color = 0x00ffff
}: {
  pointsArr: any[]
  lineType: LineType
  color?: number
}) => {
  const geometry = useBufferGeometry(pointsArr)
  const material = new THREE.LineBasicMaterial({
    color: color
  })
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
