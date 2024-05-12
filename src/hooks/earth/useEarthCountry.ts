import * as THREE from 'three'
// 导入hook
import { useEarthSphere, useCountryLine, useCountryMesh } from '@/hooks'

/**
 * 创建地球，包括地球边界线和国家版图
 * 国家球面版图设计：根据经纬度坐标进行三角面剖分，创建网格模型
 * @param path
 */
export const useEarthCountry = (R: number, path: string, isZh = false) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 2.定义组对象
  const earthGroup = new THREE.Group() as any
  // 3.创建地球
  const earth = useEarthSphere({ R })
  earthGroup.add(earth)
  // 4.创建国家网格模型数组
  const countryMeshs: THREE.Mesh[] = []
  // 4.加载world.json数据，创建边界线和国家轮廓
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      // 访问所有国家边界坐标数据：data.features
      data.features.forEach((country: any) => {
        // "Polygon"：国家country有一个封闭轮廓
        if (country.geometry.type === 'Polygon') {
          // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
          country.geometry.coordinates = [country.geometry.coordinates]
        }
        // 创建国家边界线
        const line = useCountryLine(R * 1.002, country.geometry.coordinates)
        const mesh = useCountryMesh(R * 1.002, country.geometry.coordinates)
        earthGroup.add(line)
        earthGroup.add(mesh)
        // 保存国家mesh
        countryMeshs.push(mesh)
        earthGroup.countryMeshs = countryMeshs
        // 设置每个国家mesh对应的国家名称
        if (isZh) {
          mesh.name = country.properties.nameZh
        } else {
          mesh.name = country.properties.name
        }
      })
      resolve(earthGroup)
    })
  })
}
