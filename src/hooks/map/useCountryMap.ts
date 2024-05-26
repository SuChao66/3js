import * as THREE from 'three'
// 导入hook
import { useCountryMapLine, useCountryMapMesh } from '@/hooks'

/**
 * 生成地图
 * @param path 地图数据路径
 */
export const useCountryMap = ({
  path,
  isExtruded = true,
  mapSize,
  height = 1.0
}: {
  path: string
  isExtruded?: boolean
  mapSize?: number
  height?: number
}) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 定义地图集合
  const mapGroup = new THREE.Group()
  // 定义边界线集合
  const lineGroup = new THREE.Group()
  lineGroup.position.z += height + mapSize! * 0.001 // 适当偏移解决深度冲突
  // 定义网格模型集合
  const meshGroup = new THREE.Group()
  mapGroup.add(lineGroup)
  mapGroup.add(meshGroup)
  // 2.加载数据，创建边界线
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      data.features.forEach((area: any) => {
        // "Polygon"：国家country有一个封闭轮廓
        if (area.geometry.type === 'Polygon') {
          // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
          area.geometry.coordinates = [area.geometry.coordinates]
        }
        const line = useCountryMapLine(area.geometry.coordinates) as any
        const mesh = useCountryMapMesh({
          coordinates: area.geometry.coordinates,
          isExtruded: isExtruded,
          height: height
        }) as any
        const name = area.properties.name
        const center = area.properties.center
        mesh.name = name
        mesh.center = center
        lineGroup.add(line)
        meshGroup.add(mesh)
      })
      // 设置地图底部的边界线
      const lineGroup2 = lineGroup.clone()
      lineGroup2.position.z = -mapSize! * 0.001 // 适当偏移解决深度冲突
      mapGroup.add(lineGroup2)
      // 将结果抛出去
      resolve({
        mapGroup,
        meshGroup
      })
    })
  })
}
