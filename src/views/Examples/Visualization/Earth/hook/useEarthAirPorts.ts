import * as THREE from 'three'
// 导入hook
import { useLon2xyz, usePoints } from '@/hooks'
// 导入常量
import { earthRadius } from '../constants'

/**
 * 可视化全球机场
 * @param path 机场数据
 * @param type point/texture 表示用点还是纹理进行可视化
 * @returns
 */
export const useEarthAirPorts = (path: string) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 机场组对象
  const group = new THREE.Group()
  // 2.加载数据
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      // 定义所有机场的顶点数据
      const vertices: number[] = []
      // 对机场经纬度数据进行处理
      for (let i = 0; i < data.length; i++) {
        if (data[i].longitude_deg && data[i].latitude_deg) {
          const lon = data[i].longitude_deg // 经度
          const lat = data[i].latitude_deg // 纬度
          // 将经纬度坐标转换为球坐标
          const { x, y, z } = useLon2xyz(earthRadius * 1.002, lon, lat)
          vertices.push(x, y, z)
        }
      }
      const point = usePoints({ pointsArr: vertices })
      group.add(point)
      resolve(group)
    })
  })
}
