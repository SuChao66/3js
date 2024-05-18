import * as THREE from 'three'
import { use3DTo2D, useArcFlyPathXOY } from '@/hooks'

/**
 * 绘制空间中两点之间的飞线
 * @param R 半径
 * @param startPoint 起始点
 * @param endPoint 结束点
 * @param isHelp 是否可视化绘制过程
 * @param model 模型
 * @returns
 */
export const useArcFlyPath = ({
  R,
  startPoint,
  endPoint,
  isHelp = false,
  model,
  color
}: {
  R: number
  startPoint: THREE.Vector3
  endPoint: THREE.Vector3
  isHelp?: boolean
  model: THREE.Group
  color?: number
}) => {
  // 1.计算绘制圆弧需要的关于y轴对称的起点、结束点和旋转四元数
  const { help, quaternion, startPoint_Y, endPoint_Y } = use3DTo2D(
    R,
    startPoint,
    endPoint,
    isHelp
  )
  if (isHelp) {
    model.add(help)
  }
  // 2.绘制圆弧线
  const { line, help: helpXOY } = useArcFlyPathXOY({
    R,
    startPoint: startPoint_Y,
    endPoint: endPoint_Y,
    isHelp,
    color
  })
  if (isHelp) {
    model.add(helpXOY)
  }
  // 3.将圆弧线转换回3D空间
  line.quaternion.multiply(quaternion)

  return line
}
