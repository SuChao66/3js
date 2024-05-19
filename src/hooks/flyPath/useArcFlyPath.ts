import * as THREE from 'three'
// 导入hook
import { use3DTo2D, useArcFlyPathXOY, useLine } from '@/hooks'
// 导入常量
import { LineType } from '@/enums'

/**
 * 绘制空间中两点之间的飞线
 * @param R 半径
 * @param startPoint 起始点
 * @param endPoint 结束点
 * @param isHelp 是否可视化绘制过程
 * @param model 模型
 * @param N 飞线上点分段数
 * @returns
 */
export const useArcFlyPath = ({
  R,
  startPoint,
  endPoint,
  isHelp = false,
  model,
  color,
  N = 100
}: {
  R: number
  startPoint: THREE.Vector3
  endPoint: THREE.Vector3
  isHelp?: boolean
  model: THREE.Group
  color?: number
  N?: number
}) => {
  // 1.计算绘制圆弧需要的关于y轴对称的起点、结束点和旋转四元数
  const { help, quaternion, startPoint_Y, endPoint_Y } = use3DTo2D(
    R,
    startPoint,
    endPoint,
    isHelp
  )
  // 2.绘制圆弧线
  const { line, help: helpXOY } = useArcFlyPathXOY({
    R,
    startPoint: startPoint_Y,
    endPoint: endPoint_Y,
    isHelp,
    color,
    N
  })
  // 3.可视化
  if (isHelp) {
    model.add(help)
    model.add(helpXOY)
  }
  // 4.将圆弧线转换回3D空间
  line.quaternion.multiply(quaternion)

  return {
    line
  }
}
