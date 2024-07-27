import * as THREE from 'three'
// 加载hook
import { useVideoTexture } from '@/hooks'

/**
 * 创建视频平面
 * @param param0
 */
export const useVideoPlane = ({
  videoSrc,
  position = new THREE.Vector3(0, 0, 0),
  size = new THREE.Vector2(1, 1)
}: {
  videoSrc: string
  position?: THREE.Vector3
  size?: THREE.Vector2
}) => {
  // 1.创建video纹理
  const texture = useVideoTexture({ videoSrc })
  // 2.创建一个平面
  const planeGeometry = new THREE.PlaneGeometry(size.x, size.y, 1, 1)
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    map: texture,
    alphaMap: texture
  })
  const mesh = new THREE.Mesh(planeGeometry, planeMaterial)
  mesh.position.copy(position)
  mesh.rotation.x = -Math.PI / 2

  return mesh
}
