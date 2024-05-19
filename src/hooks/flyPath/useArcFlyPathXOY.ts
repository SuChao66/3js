import * as THREE from 'three'
// 导入hook
import {
  useSphere,
  useRadianAOB,
  useThreePointCenter,
  useArcLine,
  useFlyLine
} from '@/hooks'

/**
 * 二维平面上创建飞线
 * 使用arcCurve圆弧实现
 * @param R 地球半径
 * @param startPoint 起点
 * @param endPoint 终点
 * @param isHelp 是否可视化绘制过程
 * @param N 曲线分段数
 * @param flyAngleNum 飞线弧度分段数
 */
export const useArcFlyPathXOY = ({
  R,
  startPoint,
  endPoint,
  isHelp = false,
  color,
  N,
  flyAngleNum = 7
}: {
  R: number
  startPoint: THREE.Vector3
  endPoint: THREE.Vector3
  isHelp?: boolean
  color?: number
  N?: number
  flyAngleNum?: number
}) => {
  const help = new THREE.Group()
  // 球心
  const O = new THREE.Vector3(0, 0, 0)
  // 圆心和起点之间的向量
  const OA = startPoint.clone().sub(O).normalize()
  const OB = endPoint.clone().sub(O).normalize()
  if (isHelp) {
    const OAArrow = new THREE.ArrowHelper(OA, O, R, 0x00ffff)
    const OBArrow = new THREE.ArrowHelper(OB, O, R, 0x00ffff)
    help.add(OAArrow, OBArrow)
  }
  // 0.可视化起始点
  if (isHelp) {
    const orginSphere = useSphere({ position: O })
    const startSphere = useSphere({ position: startPoint })
    const endSphere = useSphere({ position: endPoint })
    help.add(orginSphere, startSphere, endSphere)
  }
  // 1.计算起始点的中点
  const middleV3 = new THREE.Vector3()
  middleV3.addVectors(startPoint, endPoint).multiplyScalar(0.5)
  // if (isHelp) {
  //   const middleSphere = useSphere({ position: middleV3 })
  //   help.add(middleSphere)
  // }
  // 设置弦垂线的方向dir(弦的中点和圆心构成的向量)
  const dir = middleV3.clone().normalize() // {x: 0, y: 1, z: 0}
  // 2.计算球面飞线的起点、结束点和球心构成夹角的弧度值
  const angle = useRadianAOB(startPoint, endPoint, O)
  // 3.在Y轴上设置一点，表示飞线轨迹圆弧的中间点坐标
  const arcTopCoord = dir.multiplyScalar(R + angle * R * 0.2)
  // console.log(arcCoord) // {x: 0, y: 131.41592653589794, z: 0}
  if (isHelp) {
    const arcCoordSphere = useSphere({
      position: arcTopCoord,
      R: 3,
      color: 0xffff00
    })
    help.add(arcCoordSphere)
  }
  // 4.求起始点、飞线圆弧中点，三个点的外接圆圆心，即求得飞线圆弧轨迹的圆心坐标（圆的外心）
  const flyArcCenter = useThreePointCenter(startPoint, endPoint, arcTopCoord)
  if (isHelp) {
    const flyArcCenterSphere = useSphere({
      position: flyArcCenter,
      R: 3,
      color: 0x00ff00
    })
    help.add(flyArcCenterSphere)
  }
  // 5.求飞线圆弧半径
  const flyArcR = Math.abs(flyArcCenter.y - arcTopCoord.y)
  // 可视化飞线圆心和起始点
  if (isHelp) {
    const CA = startPoint.clone().sub(flyArcCenter).normalize()
    const CB = endPoint.clone().sub(flyArcCenter).normalize()
    const CAArrow = new THREE.ArrowHelper(CA, flyArcCenter, flyArcR, 0xff0000)
    const CBArrow = new THREE.ArrowHelper(CB, flyArcCenter, flyArcR, 0xff0000)
    help.add(CAArrow, CBArrow)
  }
  // 6.求飞线圆心，起始点与Y轴之间的夹角，即角AOC
  const flyRadianAngle = useRadianAOB(
    startPoint,
    new THREE.Vector3(0, -1, 0),
    flyArcCenter
  )
  const startAngle = -Math.PI / 2 + flyRadianAngle // 飞线圆弧开始角度
  const endAngle = Math.PI - startAngle // 飞线圆弧结束角度
  // 7.创建圆弧线
  const line = useArcLine({
    x: flyArcCenter.x,
    y: flyArcCenter.y,
    r: flyArcR,
    startAngle: startAngle,
    endAngle: endAngle,
    color,
    N
  }) as any
  // 给圆弧轨迹线绑定圆弧坐标、中间点坐标
  line.center = flyArcCenter
  line.topCoord = arcTopCoord
  // 飞线圆弧的弧度和轨迹线弧度相关
  const flyAngle = (endAngle - startAngle) / flyAngleNum
  // 绘制一段飞线, 圆心做坐标原点
  const flyLine = useFlyLine(flyArcR, startAngle, startAngle + flyAngle) as any
  // 平移飞线圆弧和飞线轨迹圆弧重合
  flyLine.position.y = flyArcCenter.y
  // 飞线段flyLine作为飞线轨迹arcLine子对象，继承飞线轨迹平移旋转等变换
  line.add(flyLine)
  // 飞线段运动范围startAngle ~ flyEndAngle
  flyLine.flyEndAngle = endAngle - startAngle - flyAngle
  flyLine.startAngle = startAngle
  // arcline.flyLine指向飞线段,便于设置动画
  line.flyLine = flyLine

  return {
    help,
    line
  }
}
