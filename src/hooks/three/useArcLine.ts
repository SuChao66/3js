import * as THREE from 'three'

/**
 * 创建圆弧线
 * @param x 圆心x坐标
 * @param y 圆心y坐标
 * @param r 半径
 * @param startAngle 起始角度
 * @param endAngle 结束角度
 * @returns
 */
export const useArcLine = ({
  x,
  y,
  r,
  startAngle,
  endAngle,
  N = 50,
  color = 0x00ffff
}: {
  x: number
  y: number
  r: number
  startAngle: number
  endAngle: number
  N?: number
  color?: number
}) => {
  const geometry = new THREE.BufferGeometry()
  const arc = new THREE.ArcCurve(x, y, r, startAngle, endAngle, false)
  // 曲线上获取等间隔的点
  const points = arc.getSpacedPoints(N)
  geometry.setFromPoints(points)

  const material = new THREE.LineBasicMaterial({ color: color })
  const line = new THREE.Line(geometry, material)

  return line
}
