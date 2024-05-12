import * as THREE from 'three'
// 导入hook
import { useGridPoint, useLon2xyz, useBufferGeometry } from '@/hooks'

/**
 * 创建国家球面点阵模型
 * @param R 地球半径
 * @param polygonArr 国家版图经纬度坐标  [[ [], [], [] ]]
 */
export const useCountryPoint = (R: number, polygonArr: number[][]) => {
  // 顶点经纬度坐标转化为球面坐标
  const spherePointsArr: number[] = [] // 所有三角形球面坐标
  // 顶点颜色数据
  const colorsArr: number[] = []

  polygonArr.forEach((obj: any) => {
    // 1.获取多边形轮廓数据polygon
    const polygon = obj[0]
    // 2.根据polygon边界顶点坐标填充点阵，返回边界坐标和填充顶点坐标的并集
    const newPolygonData = useGridPoint(polygon, 2, false)
    // 3.坐标转球面坐标
    newPolygonData.forEach((item) => {
      const { x, y, z } = useLon2xyz(R, item[0], item[1])
      spherePointsArr.push(x, y, z)
      let gb = Math.cos((item[1] * Math.PI) / 180) // 0~90 维度越高 亮度越低
      gb = Math.sqrt(gb)
      colorsArr.push(0, gb, gb)
    })
  })
  // 创建几何体
  const geometry = useBufferGeometry({
    pointsArr: spherePointsArr,
    colorsArr: colorsArr,
    isVertexColors: true
  })
  // 创建网格材质
  const material = new THREE.PointsMaterial({
    color: 0x00aaaa,
    size: 2
  })
  const points = new THREE.Points(geometry, material)

  return points
}
