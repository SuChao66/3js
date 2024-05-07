import * as THREE from 'three'
// 导入hook
import { useLine, useLon2xyz } from '@/hooks'
// 导入常量
import { LineType } from '@/enums'
import { earthRadius } from '../constants'

/**
 * 解析word.json数据，生成国家边界线和国家版图
 */
export const useWorldEarth = (path: string) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 边界线组对象
  const lineGroup = new THREE.Group()
  // 3.加载world.json数据
  return new Promise((resolve, reject) => {
    loader.load(path, (data: any) => {
      // 访问所有国家边界坐标数据：data.features
      data.features.forEach((country: any) => {
        // "Polygon"：国家country有一个封闭轮廓
        if (country.geometry.type === 'Polygon') {
          // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
          country.geometry.coordinates = [country.geometry.coordinates]
        }

        // 将国家经纬度坐标转换为球坐标
        country.geometry.coordinates.forEach((polygon: any) => {
          const pointArr: number[] = [] // 边界线顶点坐标
          polygon[0].forEach((elem: number[]) => {
            // 经纬度转球面坐标
            const coord = useLon2xyz(earthRadius * 1.001, elem[0], elem[1])
            pointArr.push(coord.x, coord.y, coord.z)
          })
          lineGroup.add(
            useLine({ pointsArr: pointArr, lineType: LineType.LineLoop })
          )
        })
      })

      resolve(lineGroup)
    })
  })
}
