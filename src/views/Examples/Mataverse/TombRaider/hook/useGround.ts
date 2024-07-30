import * as THREE from 'three'
// 导入hook
import { useTexture } from '@/hooks'

/**
 * 创建地面
 */
export const useGround = () => {
  // 加载纹理
  const texture = useTexture({
    path: './textures/ground.jpeg'
  })
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(10, 10)
  // 创建几何体
  const planeGeometry = new THREE.PlaneGeometry(100, 100)
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  })
  const ground = new THREE.Mesh(planeGeometry, planeMaterial)
  ground.rotation.x = -Math.PI / 2

  return ground
}
