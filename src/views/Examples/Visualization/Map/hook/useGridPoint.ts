import * as THREE from 'three'
// 多边形轮廓数据
import polygonData from '../data/polygonData.js'
// 导入hook
import { usePoints, useMinMax } from '@/hooks'
// 导入point-in-polygon
import { nested as pointInPolygonNested } from 'point-in-polygon'

/**
 * 生成多边形轮廓点阵
 */
export const useGridPoint = () => {
  // 0.处理经纬度数据
  const lonArr: number[] = [] // 所有经度数据
  const latArr: number[] = [] // 所有纬度数据
  polygonData.forEach((item: number[]) => {
    lonArr.push(item[0])
    latArr.push(item[1])
  })
  // 1.获取最大最小经纬度值
  const [minLon, maxLon] = useMinMax(lonArr)
  const [minLat, maxLat] = useMinMax(latArr)
  // 经纬度极小值和极大值构成一个矩形范围，可以包裹多边形polygon，在矩形范围内生成等间距顶点
  // 设置均匀填充点的间距
  const offset = 2
  const row = Math.ceil((maxLon - minLon) / offset) // 经度方向填充多少列的顶点
  const col = Math.ceil((maxLat - minLat) / offset) // 纬度方向填充多少行的顶点
  const pointsArr: number[][] = [] // 顶点数据
  for (let i = 0; i < row + 1; i++) {
    for (let j = 0; j < col + 1; j++) {
      pointsArr.push([minLon + i * offset, minLat + j * offset])
    }
  }

  // 2.判断点是否处于轮廓内
  const newPointsArr: number[][] = [] // 定义属于多边形轮廓内的经纬度点坐标
  pointsArr.forEach((coord: number[]) => {
    if (pointInPolygonNested(coord, polygonData)) {
      newPointsArr.push(coord)
    }
  })

  // 3.处理newPointsArr成顶点数据
  const points: number[] = [] // 定义多边形轮廓内点
  newPointsArr.forEach((obj: number[]) => {
    points.push(obj[0], obj[1], 0)
  })

  // 4.可视化多边形轮廓内点阵
  const group = new THREE.Group()
  const point = usePoints({
    pointsArr: points,
    color: new THREE.Color(0xff0000),
    size: 3.0
  })
  // group.add(point)

  const newPolygonData = [...polygonData, ...newPointsArr]

  return {
    newPolygonData,
    group
  }
}
