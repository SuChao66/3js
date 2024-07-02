import * as THREE from 'three'
// 导入hook
import { useLon2Mercator } from '@/hooks'
import { useWaveCircle } from './index.js'
// 导入shader
import output_fragment_cone from '../shaders/output_fragment_cone.glsl.js'

/**
 * 创建棱锥标注场景
 * @param param0
 */
export const useConeMesh = ({
  size,
  x,
  y
}: {
  size: number
  x: number
  y: number
}) => {
  // 0.转换为墨卡托坐标
  const xy = useLon2Mercator(x, y)
  // 1.定义棱锥的高度
  const height = size * 4
  // 2.创建四棱锥几何体
  const geometry = new THREE.ConeGeometry(size, height, 4)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, 0, height / 2)
  // 3.创建材质
  const material = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    transparent: true,
    depthTest: false,
    side: THREE.DoubleSide,
    opacity: 0.2
  })
  // 设置材质渐变，shader
  material.onBeforeCompile = (shader: any) => {
    // console.log(shader.vertexShader, shader.fragmentShader)
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      [
        'varying vec3 vPosition;',
        'void main() {',
        'vPosition = position;'
      ].join('\n')
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      ['varying vec3 vPosition;', 'void main() {'].join('\n')
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <output_fragment>',
      output_fragment_cone
    )
  }
  // 4.创建网格模型
  const mesh = new THREE.Mesh(geometry, material)
  // 创建第二个棱锥
  const mesh2 = mesh.clone()
  mesh2.scale.z = 0.5
  mesh2.position.z = height * (1 + mesh2.scale.z)
  mesh2.rotateX(Math.PI)
  mesh.add(mesh2)
  // 5.创建波动光圈
  const waveCircle = useWaveCircle({
    size: size,
    x: x,
    y: y
  }) as any
  waveCircle.position.z = height
  mesh.add(waveCircle)
  // 设置网格模型的位置
  mesh.position.set(xy.x, xy.y, 250)

  // 棱锥旋转动画
  function animation() {
    mesh.rotateZ(0.05)
    requestAnimationFrame(animation)
  }
  animation()

  return mesh
}
