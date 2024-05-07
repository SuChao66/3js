import * as THREE from 'three'
// 导入hook
import { useTexture } from '@/hooks'
// 导入常量
import { earthRadius } from '../constants'

/**
 * 创建一个地球
 */
export const useEarth = () => {
  // 加载纹理
  const texture = useTexture({ path: './images/earth/earth.png' })
  // 创建一个球体几何对象
  const geometry = new THREE.SphereGeometry(earthRadius, 40, 40)
  // 材质对象Material
  const material = new THREE.MeshLambertMaterial({
    map: texture
  })
  const mesh = new THREE.Mesh(geometry, material)

  return mesh
}
