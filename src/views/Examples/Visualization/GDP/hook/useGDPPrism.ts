import * as THREE from 'three'
import { useLon2xyz } from '@/hooks'

export const useGDPPrism = (path: string) => {
  // 加载数据
  const loader = new THREE.FileLoader()
  loader.setResponseType('json')
  return new Promise((resolve) => {
    loader.load(path, (data) => {
      resolve(data)
    })
  })
}

/**
 * 创建GDP光柱
 * @param R：半径
 * @param lon：经度
 * @param lat：纬度
 * @param height：光柱高度
 * @param color：光柱颜色
 */
export const createPrism = (
  R: number,
  lon: number,
  lat: number,
  height: number,
  color: THREE.Color
) => {
  // 1.创建一个正六棱柱
  const geometry = new THREE.CylinderGeometry(1.0, 1.0, height, 6)
  // 高度方向旋转到Z轴上
  geometry.rotateX(Math.PI / 2)
  // 平移使光柱底部与XOY平面重合
  geometry.translate(0, 0, height / 2)
  // 2.创建材质
  const material = new THREE.MeshLambertMaterial({
    color: color
  })
  // 3.创建mesh
  const mesh = new THREE.Mesh(geometry, material)
  // 4.经纬度转球面坐标
  const { x, y, z } = useLon2xyz(R, lon, lat)
  // 设置mesh的位置
  mesh.position.set(x, y, z)
  // 设置mesh的姿态
  const coordVec3 = new THREE.Vector3(x, y, z).normalize()
  const meshNormal = new THREE.Vector3(0, 0, 1)
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)

  return mesh
}
