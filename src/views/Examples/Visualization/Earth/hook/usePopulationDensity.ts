import * as THREE from 'three'
import { useLon2xyz, useMinMax, useSort } from '@/hooks'
// 导入常量
import { earthRadius } from '../constants'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * 初始化人口密度
 * @param path
 */
export const usePopulationDensity = (path: string) => {
  const loader = new THREE.FileLoader()
  loader.setResponseType('json')
  // 声明一个组对象包含人口密度柱子mesh，方便引入到场景
  const group = new THREE.Group()
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      // 人口密度几何体
      const geoArr = []
      // 获取人口密度最大值
      const coordArr: number[] = []
      data.population.forEach((item: any) => {
        coordArr.push(item[2])
      })
      const newCoordArr: number[] = coordArr.sort(useSort)
      const [min, max] = useMinMax(newCoordArr)
      const Max = max * 0.05
      const color1 = new THREE.Color(0x00aa88)
      const color2 = new THREE.Color(0x00ff88)

      for (let i = 0; i < data.population.length; i++) {
        // 人口密度
        const populationDensity = data.population[i][2]
        // 经纬度
        const lon = data.population[i][0]
        const lat = data.population[i][1]
        // 光柱高度
        const height = populationDensity / 50
        // 创建几何体
        const geometry = new THREE.BoxGeometry(0.5, 0.5, height)
        // 设置几何体的颜色
        const colorArr = []
        const color = color1
          .clone()
          .lerp(color2.clone(), populationDensity / Max)
        const pos = geometry.attributes.position
        for (let j = 0; j < pos.count; j++) {
          if (pos.getZ(j) < 0) {
            // 柱子几何体底部顶点的颜色
            colorArr.push(color.r * 0.0, color.g * 0.1, color.b * 0.1)
          } else {
            // 柱子几何体顶部顶点对应颜色
            colorArr.push(color.r * 0.0, color.g * 1.0, color.b * 1.0)
          }
        }
        geometry.attributes.color = new THREE.BufferAttribute(
          new Float32Array(colorArr),
          3
        )

        // 经纬度转球面坐标
        const { x, y, z } = useLon2xyz(earthRadius, lon, lat)
        // 将几何体沿着Z轴移动R+height / 2
        geometry.translate(0, 0, earthRadius + height / 2)
        // 通过lookAt调整几何体姿态角度
        geometry.lookAt(new THREE.Vector3(x, y, z))
        geoArr.push(geometry)
      }

      // 合并几何体
      const buffergeometry = mergeBufferGeometries(geoArr)
      // 创建材质
      const material = new THREE.MeshLambertMaterial({
        // color: 0x00ffff
        vertexColors: true
      })
      const mesh = new THREE.Mesh(buffergeometry, material)
      group.add(mesh)

      resolve(group)
    })
  })
}
