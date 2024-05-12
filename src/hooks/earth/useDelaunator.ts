// 导入hook
import { useTriangularCenter } from '@/hooks'
// 三角剖分
import Delaunator from 'delaunator'
// 导入point-in-polygon
import { nested as pointInPolygonNested } from 'point-in-polygon'

/**
 * 对多边形轮廓内的数据进行三角剖分
 * @param points: 多边形轮廓内经纬度点坐标(包括轮廓上的点)
 * @param pos: 多边形轮廓内点
 */
export const useDelaunator = (
  newPolygonData: number[][],
  polygon: number[][]
) => {
  // 获取三角形索引值
  const indexArr = Delaunator.from(newPolygonData).triangles
  // 去除多边形轮廓外的索引
  // 删除多边形polygon外面三角形，判断方法非常简单，判断一个三角形的质心是否在多边形轮廓内部
  const usefulIndexArr: number[] = []
  for (let i = 0; i < indexArr.length; i += 3) {
    // 三角形三个顶点坐标p1, p2, p3
    const p1 = newPolygonData[indexArr[i]]
    const p2 = newPolygonData[indexArr[i + 1]]
    const p3 = newPolygonData[indexArr[i + 2]]
    // 三角形重心坐标计算
    const center = useTriangularCenter(p1, p2, p3)
    if (pointInPolygonNested(center, polygon)) {
      usefulIndexArr.push(indexArr[i + 2], indexArr[i + 1], indexArr[i])
    }
  }

  return usefulIndexArr
}
