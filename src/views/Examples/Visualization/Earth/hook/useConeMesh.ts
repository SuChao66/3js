import * as THREE from 'three'
import { useLon2xyz } from '@/hooks'

export const useConeMesh = (R: number, lon: number, lat: number) => {
  const radius = R / 18 // 圆锥半径  和地球半径建立尺寸关系
  const height = radius * 4 // 棱锥高度
  // 圆锥体几何体API(ConeGeometry)圆周方向四等分实现四棱锥效果
  const geometry = new THREE.ConeGeometry(radius, height, 4)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, 0, height / 2)
  // MeshBasicMaterial MeshLambertMaterial
  const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff
  })
  const mesh = new THREE.Mesh(geometry, material)
  // 棱锥上在叠加一个棱锥
  const mesh2 = mesh.clone()
  mesh2.scale.z = 0.5
  mesh2.position.z = height * (1 + mesh2.scale.z)
  mesh2.rotateX(Math.PI)
  mesh.add(mesh2)

  // 经纬度转球面坐标
  const coord = useLon2xyz(R * 1.002, lon, lat)
  // 设置mesh位置
  mesh.position.set(coord.x, coord.y, coord.z)
  // mesh姿态设置
  // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
  var coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize()
  // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
  var meshNormal = new THREE.Vector3(0, 0, 1)
  // 四元数属性.quaternion表示mesh的角度状态
  //.setFromUnitVectors();计算两个向量之间构成的四元数值
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)

  return mesh
}
