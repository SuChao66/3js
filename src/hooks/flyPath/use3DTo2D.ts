import * as THREE from 'three'
// 导入hook
import { useSphere } from '@/hooks'

/**
 * 将空间中的两个点转换到XOY平面上，且关于Y轴对称
 * @param R 半径
 * @param startPoint 起始点
 * @param endPoint 结束点
 * @param isHelp 是否可视化转换过程
 * 思路：
 * 1.把3D球面上任意的两个飞线起点和结束点绕球心旋转到到XOY平面上，
 * 2.将XOY平面上的两个点，转换为保持关于y轴对称，借助旋转得到的新起点和新结束点绘制一个圆弧
 * 3.最后把绘制的圆弧反向旋转到原来的起点和结束点即可
 */
export const use3DTo2D = (
  R: number,
  startPoint: THREE.Vector3,
  endPoint: THREE.Vector3,
  isHelp = false
) => {
  const help = new THREE.Group()
  // 0.球心坐标
  const O = new THREE.Vector3(0, 0, 0)
  // 可视化起始点
  if (isHelp) {
    const startSphere = useSphere({ position: startPoint, R: 2 })
    const endSphere = useSphere({ position: endPoint, R: 2 })
    help.add(startSphere, endSphere)
  }
  const startDir = startPoint.clone().sub(O) //飞线起点与球心构成方向向量
  const endDir = endPoint.clone().sub(O) //飞线结束点与球心构成方向向量
  if (isHelp) {
    const startArrow = new THREE.ArrowHelper(
      startDir.normalize(),
      O,
      R,
      0xff0000
    )
    const endArrow = new THREE.ArrowHelper(endDir.normalize(), O, R, 0xff0000)
    help.add(startArrow, endArrow)
  }

  // 1.计算AOB的法线
  const normal = startDir.clone().cross(endDir).normalize()
  if (isHelp) {
    const normalArrow = new THREE.ArrowHelper(normal, O, R * 0.8, 0x00ff00)
    help.add(normalArrow)
  }
  // 2.定义XOY平面的法线
  const xoyNormal = new THREE.Vector3(0, 0, 1) // XOY平面的法线
  if (isHelp) {
    const xoyNormalArrow = new THREE.ArrowHelper(
      xoyNormal,
      O,
      R * 0.8,
      0x0000ff
    )
    help.add(xoyNormalArrow)
  }

  // 3.计算从normal向量旋转达到xoyNormal向量所需要的四元数
  const quaternion3D_XOY = new THREE.Quaternion().setFromUnitVectors(
    normal,
    xoyNormal
  )
  // console.log(quaternion3D_XOY)
  /*第一次旋转：将飞线起点、结束点从3D空间第一次旋转到XOY平面*/
  const startPointXOY = startPoint.clone().applyQuaternion(quaternion3D_XOY)
  const endPointXOY = endPoint.clone().applyQuaternion(quaternion3D_XOY)
  // console.log(startPointXOY, endPointXOY)
  if (isHelp) {
    const startPointXOYSphere = useSphere({
      position: startPointXOY,
      R: 3,
      color: 0x00ff00
    })
    const endPointXOYSphere = useSphere({
      position: endPointXOY,
      R: 3,
      color: 0x00ff00
    })
    help.add(startPointXOYSphere, endPointXOYSphere)
  }

  // 4.计算第二次旋转的四元数
  //middleV3：startSphereXOY和endSphereXOY的中点
  const middleV3 = startPointXOY.clone().add(endPointXOY).multiplyScalar(0.5)
  // 旋转前向量midDir，中点middleV3和球心构成的方向向量
  const midDir = middleV3.clone().sub(O).normalize()
  // 旋转后向量yDir，即y轴
  const yDir = new THREE.Vector3(0, 1, 0)
  const quaternionXOY_Y = new THREE.Quaternion().setFromUnitVectors(
    midDir,
    yDir
  )
  /*第二次旋转：使旋转到XOY平面的点再次旋转，实现关于Y轴对称*/
  const startPointXOY_Y = startPointXOY.clone().applyQuaternion(quaternionXOY_Y)
  const endPointXOY_Y = endPointXOY.clone().applyQuaternion(quaternionXOY_Y)
  if (isHelp) {
    const middleV3Sphere = useSphere({
      position: middleV3,
      R: 3,
      color: 0x00ffff
    })
    const midDirArrow = new THREE.ArrowHelper(
      midDir.normalize(),
      O,
      R * 0.6,
      0xffff00
    )
    const startPointXOY_YSphere = useSphere({
      position: startPointXOY_Y,
      R: 5,
      color: 0xff00ff
    })
    const endPointXOY_YSphere = useSphere({
      position: endPointXOY_Y,
      R: 5,
      color: 0xff00ff
    })
    help.add(
      middleV3Sphere,
      midDirArrow,
      startPointXOY_YSphere,
      endPointXOY_YSphere
    )
  }

  // 5.求逆矩阵
  // 一个四元数表示一个旋转过程 .invert()方法表示四元数的逆，
  // 简单说就是把旋转过程倒过来,两次旋转的四元数执行.invert()求逆，然后执行.multiply()
  const quaternionInverse = quaternion3D_XOY
    .clone()
    .invert()
    .multiply(quaternionXOY_Y.clone().invert())

  return {
    help,
    // 返回两次旋转四元数的逆四元数
    quaternion: quaternionInverse,
    // 返回两次旋转后在XOY平面上关于y轴对称的圆弧起点和结束点坐标
    startPoint_Y: startPointXOY_Y,
    endPoint_Y: endPointXOY_Y
  }
}
