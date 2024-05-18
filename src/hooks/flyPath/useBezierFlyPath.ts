import * as THREE from 'three'
// 导入hook
import { useLon2xyz, useSphere } from '@/hooks'

/**
 * 思路：
 *    1.将起始点转换为球面坐标，创建轨迹线起始点向量，记为A、B
 *    2.创建球心原点O，到起始点之间的向量，记为OA、OB
 *    3.叉乘计算OA、OB的法线，记为normal
 *    4.叉乘计算OA与normal、OB与normal的法线，即起始点的切线，分别记为tangentA、tangentB
 *    5.OA与OB点乘，计算AOB的夹角，记为angle
 *    6.获取tangentA、tangentB相交点，记为C点，创建AC、BC向量
 *    7.分别在两条切线上取一点，记为贝塞尔控制点P2、P3
 *    8.根据起始点、P2、P3创建贝塞尔曲线
 */

/**
 * 使用贝塞尔曲线实现飞线效果
 * @param R 地球半径
 * @param start 起始点 [ 经度，纬度 ]
 * @param end 结束点 [ 经度，纬度 ]
 */
export const useBezierFlyPath = ({
  R,
  start,
  end,
  isHelp = false
}: {
  R: number
  start: number[]
  end: number[]
  isHelp?: boolean
}) => {
  // 0. 定义球心原点坐标
  const O = new THREE.Vector3(0, 0, 0)
  // 可视化组
  const help = new THREE.Group()
  // 1.经纬度转球面坐标
  const startCoord = useLon2xyz(R, start[0], start[1])
  const endCoord = useLon2xyz(R, end[0], end[1])
  // 2.创建轨迹线起始点向量
  const startPoint = new THREE.Vector3(startCoord.x, startCoord.y, startCoord.z)
  const endPoint = new THREE.Vector3(endCoord.x, endCoord.y, endCoord.z)
  // 3.创建原点与飞线起始点之间的向量
  const startDir = startPoint.clone().sub(O).normalize()
  const endDir = endPoint.clone().sub(O).normalize()
  // 可视化向量
  if (isHelp) {
    const startArrow = new THREE.ArrowHelper(startDir, O, R, 0x00ffff)
    const endArrow = new THREE.ArrowHelper(endDir, O, R, 0x00ffff)
    help.add(startArrow, endArrow)
    const origin = useSphere({ position: O })
    const startSphere = useSphere({ position: startPoint })
    const endSphere = useSphere({ position: endPoint })
    help.add(origin, startSphere, endSphere)
  }
  // 4.叉乘计算O、startDir、endDir的法线
  const normal = startDir.clone().cross(endDir.clone()).normalize()
  if (isHelp) {
    const normalArrow = new THREE.ArrowHelper(normal, O, R, 0x0000ff)
    help.add(normalArrow)
  }
  // 5.叉乘计算startDir/endDir和normal的法线，即起始点和结束点的切线
  const startTangent = startDir.clone().cross(normal.clone()).normalize()
  const endTangent = endDir.clone().cross(normal.clone()).normalize()
  startTangent.negate() // 向量startTangent取反
  // 6.获取轨迹线起始点和球心构成的夹角(弧度值)
  const angle = Math.acos(startDir.clone().dot(endDir.clone()))
  // 7.假设两切线的交点是C，计算起始点/结束点到切线相交点的长度
  const length = R * Math.tan(angle / 2)
  // 求出相交点的向量
  const C = startPoint.clone().add(startTangent.clone().multiplyScalar(length))
  if (isHelp) {
    const startTangentArrow = new THREE.ArrowHelper(
      startTangent,
      startPoint,
      length,
      0xffff00
    )
    const endTangentArrow = new THREE.ArrowHelper(
      endTangent,
      endPoint,
      length,
      0xffff00
    )
    help.add(startTangentArrow, endTangentArrow)
    const cSphere = useSphere({ position: C })
    help.add(cSphere)
  }
  // 8.获取贝塞尔曲线的控制点坐标
  const L = length * 0.8
  const p2 = startPoint.clone().add(startTangent.clone().multiplyScalar(L))
  const p3 = endPoint.clone().add(endTangent.clone().multiplyScalar(L))
  if (isHelp) {
    const p2Sphere = useSphere({ R: 2, position: p2, color: 0x00ffff })
    const p3Sphere = useSphere({ R: 2, position: p3, color: 0x00ffff })
    help.add(p2Sphere, p3Sphere)
  }
  // 9.创建贝塞尔曲线
  const curve = new THREE.CubicBezierCurve3(startPoint, p2, p3, endPoint)
  const pointsArr = curve.getSpacedPoints(100)
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(pointsArr)
  const material = new THREE.LineBasicMaterial({ color: 0x00ffff })
  const flyPath = new THREE.Line(geometry, material)

  return {
    help,
    flyPath
  }
}
