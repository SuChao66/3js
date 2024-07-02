import * as THREE from 'three'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
// 导入hook
import { useBuild } from './useBuild'

/**
 * 生成外滩建筑群
 * @param param0
 * @returns
 */
export const useHuangPuRiver = ({ path }: { path: string }) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 2.定义一个几何体数组
  const geometryArrs: THREE.ExtrudeGeometry | THREE.ShapeGeometry[] = []

  // 3.加载数据
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      data.features.forEach((build: any) => {
        if (build.geometry) {
          if (build.geometry.type === 'Polygon') {
            build.geometry.coordinates = [build.geometry.coordinates]
          }
          // 创建黄浦江
          const riverGeometry = useBuild({
            pointsArrs: build.geometry.coordinates
          })
          geometryArrs.push(riverGeometry)
        }
      })
      // 将所有几何体合并成一个几何体
      const geometry = mergeBufferGeometries(geometryArrs)
      // 创建材质
      const material = new THREE.MeshLambertMaterial({
        color: 0x009999
      })
      const mesh = new THREE.Mesh(geometry, material)

      resolve(mesh)
    })
  })
}
