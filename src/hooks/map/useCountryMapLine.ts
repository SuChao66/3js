import * as THREE from 'three'
import { useLine, useLon2Mercator } from '@/hooks'
// 导入常量
import { LineType } from '@/enums'

/**
 * 生成地图国家边界线
 * @param coordinates 国家坐标数据
 */
export const useCountryMapLine = (coordinates: number[][]) => {
  const lineGroup = new THREE.Group()

  coordinates.forEach((polygon: any) => {
    const pointsArr: number[] = [] // 边界线顶点坐标
    polygon[0].forEach((elem: number[]) => {
      // 经纬度转墨卡托坐标
      const { x, y } = useLon2Mercator(elem[0], elem[1])
      pointsArr.push(x, y, 0)
    })
    // 生成边界线
    const line = useLine({
      pointsArr: pointsArr,
      lineType: LineType.Line
    })
    lineGroup.add(line)
  })

  return lineGroup
}
