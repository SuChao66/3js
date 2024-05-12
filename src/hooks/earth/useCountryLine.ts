import * as THREE from 'three'
// 导入hook
import { useLine, useLon2xyz } from '@/hooks'
// 导入常量
import { LineType } from '@/enums'

/**
 * 创建国家边界线
 * @param R 地球半径
 * @param polygonArr 国家经纬度坐标 [[ [], [], [] ]]
 * @returns
 */
export const useCountryLine = (R: number, polygonArr: number[][]) => {
  // 边界线组对象
  const lineGroup = new THREE.Group()
  // 所有边界线顶点坐标合并在一起，适合使用LineSegments渲染
  const allPointArr: number[] = []
  // 将国家经纬度坐标转换为球坐标
  polygonArr.forEach((polygon: any) => {
    const pointsArr: number[] = [] // 边界线顶点坐标
    polygon[0].forEach((elem: number[]) => {
      // 经纬度转球面坐标
      const coord = useLon2xyz(R, elem[0], elem[1])
      pointsArr.push(coord.x, coord.y, coord.z)
    })
    // 处理顶点数据适合LineSegments连续渲染所有独立不相连轨迹线
    allPointArr.push(pointsArr[0], pointsArr[1], pointsArr[2])
    for (let i = 3; i < pointsArr.length - 3; i += 3) {
      // 如果使用LineSegments连线，需要把顶点多复制一份
      allPointArr.push(
        pointsArr[i],
        pointsArr[i + 1],
        pointsArr[i + 2],
        pointsArr[i],
        pointsArr[i + 1],
        pointsArr[i + 2]
      )
    }
    const index = pointsArr.length - 3
    // 获取后三个数据
    allPointArr.push(
      pointsArr[index],
      pointsArr[index + 1],
      pointsArr[index + 2]
    )
  })
  // 3.加载world.json数据
  const line = useLine({
    pointsArr: allPointArr,
    lineType: LineType.LineSegments
  })
  lineGroup.add(line)

  return lineGroup
}
