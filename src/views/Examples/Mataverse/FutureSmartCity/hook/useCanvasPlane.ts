import * as THREE from 'three'
// 加载hook
import { useCanvasTexture } from '@/hooks'

/**
 * 创建canmvas平面
 * @param param0
 */
export const useCanvasPlane = async ({
  imageSrc,
  text,
  position = new THREE.Vector3(0, 0, 0),
  size = new THREE.Vector2(1, 1),
  euler = new THREE.Euler(0, 0, 0)
}: {
  imageSrc: string
  text: string
  position?: THREE.Vector3
  size?: THREE.Vector2
  euler?: THREE.Euler
}) => {
  // 1.创建canvas纹理
  const texture = (await useCanvasTexture({ imageSrc, text })) as any

  return new Promise((resolve) => {
    // 2.创建一个平面
    const planeGeometry = new THREE.PlaneGeometry(
      size.x,
      size.y * (2 / 3),
      1,
      1
    )
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
    mesh.rotation.copy(euler)
    mesh.visible = false

    resolve(mesh)
  })
}
