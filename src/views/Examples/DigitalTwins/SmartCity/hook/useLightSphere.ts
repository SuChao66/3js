import * as THREE from 'three'
// 导入shader
import vertexShader from '../shaders/light_sphere_vertex.glsl.js'
import fragmentShader from '../shaders/light_sphere_fragment.glsl.js'

/**
 * 使用shaderMaterial创建一个透明发光的球
 * @param param0
 */
export const useLightSphere = ({
  radius,
  widthSegments = 32,
  heightSegments = 16
}: {
  radius: number
  widthSegments?: number
  heightSegments?: number
}) => {
  // 创建几何体
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  )
  // 创建shader材质
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true
  })
  const mesh = new THREE.Mesh(geometry, material)

  // 波动动画
  const S = 1.5 //波动范围设置
  let _s = 1.0
  function waveAnimation() {
    _s += 0.01
    mesh.scale.set(_s, _s, _s)
    if (_s > S) _s = 1.0
    requestAnimationFrame(waveAnimation)
  }
  waveAnimation()

  return mesh
}
