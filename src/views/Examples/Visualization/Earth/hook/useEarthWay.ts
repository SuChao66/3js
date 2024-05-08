import * as THREE from 'three'
// 导入hook
import { useLine, useLon2xyz } from '@/hooks'
// 导入常量
import { LineType } from '@/enums'
import { earthRadius } from '../constants'

/**
 * 解析word.json数据，生成国家边界线和国家版图
 */
export const useEarthWay = (path: string) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 边界线组对象
  const lineGroup = new THREE.Group()
  // 所有边界线顶点坐标合并在一起，适合使用LineSegments渲染
  const allPointArr: number[] = []
  // 3.加载world.json数据
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      data.features.forEach((obj: any) => {
        // "MultiLineString"：obj对象包含多条轨迹曲线
        if (obj.geometry.type === 'LineString') {
          // 把"LineString"和"MultiLineString"的geometry.coordinates数据结构处理为一致
          obj.geometry.coordinates = [obj.geometry.coordinates]
        }
        obj.geometry.coordinates.forEach((arr: any[]) => {
          const pointsArr: number[] = []
          arr.forEach((elem: number[]) => {
            // 经纬度转球面坐标
            const coord = useLon2xyz(earthRadius, elem[0], elem[1])
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
      })
      lineGroup.add(
        useLine({
          pointsArr: allPointArr,
          lineType: LineType.LineSegments,
          color: new THREE.Color(0xffff00)
        })
      )
      resolve(lineGroup)
    })
  })
}
