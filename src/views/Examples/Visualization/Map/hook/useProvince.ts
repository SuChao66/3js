import * as THREE from 'three'
// 导入hook
import { useLon2Mercator } from '@/hooks'

// 矩形平面网格模型设置背景透明的png贴图
const geometry = new THREE.PlaneGeometry(1, 1)
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./images/planets/贴图.png')
const material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true // 使用背景透明的png贴图，注意开启透明计算
})

const cityPointMesh = (size: number, x: number, y: number, z: number) => {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.scale.set(size, size, size) //设置mesh大小
  mesh.position.set(x, y, z) //设置mesh位置

  return mesh
}

/**
 * 可视化省份行政中心
 * @param param0
 * @returns
 */
export const useProvince = ({
  path,
  mapSize
}: {
  path: string
  mapSize: number
}) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 定义省份行政中心集合
  const provinceGroup = new THREE.Group()
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      data.features.forEach((area: any) => {
        const pos = area.properties.center // 每个省份行政中心位置经纬度
        if (pos) {
          const size = mapSize * 0.025
          const z = mapSize * 0.025
          // 将经纬度转墨卡托坐标
          const { x, y } = useLon2Mercator(pos[0], pos[1])
          // 生成行政中心mesh
          const mesh = cityPointMesh(size, x, y, z)
          provinceGroup.add(mesh)
        }
      })

      resolve(provinceGroup)
    })
  })
}
