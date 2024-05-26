import * as THREE from 'three'
// 导入hook
import { useLon2Mercator } from '@/hooks'

/**
 * 创建光柱
 * @param mapSize
 * @param lon
 * @param lat
 * @returns
 */
export const useConeMesh = (mapSize: number, lon: number, lat: number) => {
  const radius = mapSize / 80 // 圆锥半径  和地球半径建立尺寸关系
  const height = radius * 5 // 棱锥高度
  // 圆锥体几何体API(ConeGeometry)圆周方向四等分实现四棱锥效果
  const geometry = new THREE.ConeGeometry(radius, height, 4)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, 0, height / 2)
  const material = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    transparent: true,
    opacity: 0.8
  })
  const mesh = new THREE.Mesh(geometry, material)
  // 棱锥上在叠加一个棱锥
  const mesh2 = mesh.clone()
  mesh2.scale.z = 0.5
  mesh2.position.z = height * (1 + mesh2.scale.z)
  mesh2.rotateX(Math.PI)
  mesh.add(mesh2)

  // 经纬度转球面坐标
  const coord = useLon2Mercator(lon, lat)
  // 设置mesh位置
  mesh.position.set(coord.x, coord.y, mapSize * 0.02)
  mesh.rotateX(-Math.PI / 4)

  return mesh
}
