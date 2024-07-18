import * as THREE from 'three'
// 导入shader
import vertexShader from '../shaders/lightWall/vertex.glsl'
import fragmentShader from '../shaders/lightWall/fragment.glsl'
// 导入动画库
import gsap from 'gsap'

/**
 * 使用圆柱缓冲几何体创建光墙
 */
export const useLightWall = ({
  radius = 3,
  height = 2,
  position = new THREE.Vector3(0, 3, 0)
}: {
  radius?: number
  height?: number
  position?: THREE.Vector3
}) => {
  // 1.创建几何体
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius,
    height,
    32,
    1,
    true
  )
  // 2.创建材质
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uHeight: {
        value: 0.0
      }
    }
  })
  // 3.创建模型
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.copy(position)

  // uniform
  mesh.geometry.computeBoundingBox()
  const { min, max } = mesh.geometry.boundingBox!
  // 获取物体高度差
  const uHeight = max.y - min.y
  material.uniforms.uHeight = {
    value: uHeight
  }

  gsap.to(mesh.scale, {
    x: height,
    z: height,
    duration: 1,
    repeat: -1,
    yoyo: true
  })

  return mesh
}
