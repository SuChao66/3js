import * as THREE from 'three'

/**
 * 求三个点的外接圆圆心
 * 外心：三角形三条边的垂直平分线的交点
 * @param p1
 * @param p2
 * @param p3
 */
export const useThreePointCenter = (
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  p3: THREE.Vector3
) => {
  const L1 = p1.lengthSq() // p1到坐标原点距离的平方
  const L2 = p2.lengthSq()
  const L3 = p3.lengthSq()
  const x1 = p1.x,
    y1 = p1.y,
    x2 = p2.x,
    y2 = p2.y,
    x3 = p3.x,
    y3 = p3.y
  const S = x1 * y2 + x2 * y3 + x3 * y1 - x1 * y3 - x2 * y1 - x3 * y2
  const x = (L2 * y3 + L1 * y2 + L3 * y1 - L2 * y1 - L3 * y2 - L1 * y3) / S / 2
  const y = (L3 * x2 + L2 * x1 + L1 * x3 - L1 * x2 - L2 * x3 - L3 * x1) / S / 2
  // 三点外接圆圆心坐标
  const center = new THREE.Vector3(x, y, 0)

  return center
}
