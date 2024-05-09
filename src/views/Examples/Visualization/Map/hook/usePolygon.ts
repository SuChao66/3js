import * as THREE from 'three'
// 多边形轮廓数据
import polygonData from '../data/polygonData.js'
// 导入hook
import { useLine, usePoints } from '@/hooks'
// 导入常量
import { LineType } from '@/enums'

/**
 * 可视化多边形轮廓
 * @param path
 */
export const usePolygon = () => {
  // 处理多边形外轮顶点坐标，用于生成几何体顶点坐标
  const pointsArr: number[] = []
  polygonData.forEach((elem: number[]) => {
    pointsArr.push(elem[0], elem[1], 0)
  })
  // 定义多边形轮廓数据
  const group = new THREE.Group()
  // 生成多边形边界线和点
  const lineGroup = new THREE.Group()
  const pointGroup = new THREE.Group()
  const line = useLine({
    pointsArr: pointsArr,
    lineType: LineType.Line
  })
  lineGroup.add(line)
  // const point = usePoints({
  //   pointsArr: pointsArr,
  //   size: 3.0
  // })
  // pointGroup.add(point)

  group.add(lineGroup, pointGroup)

  return group
}
