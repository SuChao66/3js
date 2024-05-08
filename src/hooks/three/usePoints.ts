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
  color = 0xffff00,
  size = 1.0
}: {
  pointsArr: number[]
  color?: number
  size?: number
}) => {
  const geometry = useBufferGeometry(pointsArr)
  const material = new THREE.PointsMaterial({
    color: color,
    size: size
  })
  const point = new THREE.Points(geometry, material)

  return point
}
