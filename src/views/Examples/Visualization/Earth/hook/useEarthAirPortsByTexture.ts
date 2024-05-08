import * as THREE from 'three'
// 导入hook
import { useMarkPoint } from './'

/**
 * 可视化全球机场(通过纹理贴图的形式)
 * @param path 机场数据
 * @param type point/texture 表示用点还是纹理进行可视化
 * @returns
 */
export const useEarthAirPortsByTexture = (path: string) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 机场组对象
  const group = new THREE.Group()
  // 2.加载数据
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      // 对机场经纬度数据进行处理
      data.geometries.forEach((item: any) => {
        const lon = item.coordinates[0]
        const lat = item.coordinates[1]
        // 用纹理贴图可视化机场
        const mesh = useMarkPoint({
          path: './images/planets/airPlane.png',
          lon: lon,
          lat: lat,
          minScale: 0.03,
          color: 0xffff00,
          isAnimation: false
        })
        group.add(mesh)
      })

      resolve(group)
    })
  })
}
