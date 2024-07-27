import * as THREE from 'three'
// 加载hook
import { useVideoPlane } from './useVideoPlane'

/**
 * 创建传送门
 * @param path 纹理路径
 */
export const usePortals = ({
  videoSrc,
  position = new THREE.Vector3(0, 0, 0),
  size = new THREE.Vector2(1, 1)
}: {
  videoSrc: string
  position?: THREE.Vector3
  size?: THREE.Vector2
}) => {
  // 0.创建组
  const group = new THREE.Group()
  // 1.创建video平面
  const mesh = useVideoPlane({
    videoSrc,
    position,
    size
  })
  // 2.创建柱体
  const lightTexture = new THREE.TextureLoader().load('./textures/流动.png')
  lightTexture.wrapS = THREE.RepeatWrapping
  lightTexture.wrapT = THREE.RepeatWrapping
  lightTexture.repeat.set(3, 3)
  const cylinderGeometry = new THREE.CylinderGeometry(
    size.x / 2,
    size.y / 2,
    2.5,
    32,
    1,
    true
  )
  const cylinderMaterial = new THREE.MeshBasicMaterial({
    color: 0x074d9,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
    map: lightTexture
  })
  const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial)

  // 5.创建渐变柱体
  const cylinderMeshFade = cylinderMesh.clone()
  cylinderMeshFade.material = cylinderMesh.material.clone()
  cylinderMeshFade.material.map = new THREE.TextureLoader().load(
    './textures/渐变.png'
  )
  cylinderMeshFade.material.color.set(0x074d9)
  cylinderMeshFade.scale.set(1.01, 1.01, 1.0)

  group.add(mesh)
  group.add(cylinderMesh)
  group.add(cylinderMeshFade)
  group.visible = false

  function flowAnimation() {
    requestAnimationFrame(flowAnimation)
    lightTexture.offset.y -= 0.01
  }
  flowAnimation()

  return group
}
