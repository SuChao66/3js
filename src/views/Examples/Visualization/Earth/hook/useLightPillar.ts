import * as THREE from 'three'
// 导入hook
import { useTexture, useLon2xyz } from '@/hooks'
// 导入常量
import { earthRadius } from '../constants'

/**
 * 创建光柱
 * @param R 地球半径
 * @param lon 经度
 * @param lat 纬度
 * @param color 颜色
 */
export const useLightPillar = ({
  path,
  lon,
  lat,
  color = 0x44ffaa,
  h = 0.1
}: {
  path: string
  lon: number
  lat: number
  color?: number
  h: number
}) => {
  // 1.加载精灵
  const texture = useTexture({ path: path })
  // 2.创建光柱
  const height = earthRadius * h //光柱高度，和地球半径相关，这样调节地球半径，光柱尺寸跟着变化
  const geometry = new THREE.PlaneGeometry(height * 0.2, height) // 默认在XOY平面上
  geometry.rotateX(Math.PI / 2) // 光柱高度方向旋转到z轴上
  geometry.translate(0, 0, height / 2) // 平移使光柱底部与XOY平面重合
  const material = new THREE.MeshBasicMaterial({
    color: color, // 光柱颜色，光柱map贴图是白色，可以通过color调节颜色
    map: texture,
    transparent: true, // 使用背景透明的png贴图，注意开启透明计算
    side: THREE.DoubleSide, // 双面可见
    depthWrite: false // 是否对深度缓冲区有任何的影响
  })
  const mesh = new THREE.Mesh(geometry, material) as any
  const group = new THREE.Group()
  group.add(mesh, mesh.clone().rotateZ(Math.PI / 2))
  // 3.经纬度转球面坐标，将精灵图设置在地球表面
  const { x, y, z } = useLon2xyz(earthRadius * 1.002, lon, lat)
  group.position.set(x, y, z)
  // 4.设置精灵图的角度
  // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
  const coordVec3 = new THREE.Vector3(x, y, z).normalize()
  const meshNormal = new THREE.Vector3(0, 0, 1)
  //.setFromUnitVectors();计算两个向量之间构成的四元数值
  group.quaternion.setFromUnitVectors(meshNormal, coordVec3)

  return group
}
