import * as THREE from 'three'
// 导入hook
import { useLon2Mercator } from '@/hooks'

/**
 * 创建波动光圈效果
 * @param param0
 */
export const useWaveCircle = ({
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
  // 1.创建几何体
  const geometry = new THREE.PlaneGeometry(size, size)
  // 2.创建材质
  const textureLoader = new THREE.TextureLoader()
  let material = new THREE.MeshBasicMaterial({
    color: 0xffff00, //设置光圈颜色
    map: textureLoader.load('./images/planets/circle.png'),
    transparent: true, //使用背景透明的png贴图，注意开启透明计算
    depthTest: false //禁止深度测试,以免光圈和地面或河流表面深度冲突
  })
  // 3.创建网格模型
  const mesh = new THREE.Mesh(geometry, material)

  // 波动动画
  let S = 20
  let _s = 1.0

  function waveAnimation() {
    _s += 0.2
    mesh.scale.set(_s, _s, _s)
    if (_s <= S * 0.2) {
      material.opacity = (_s - 1) / (S * 0.2 - 1)
    } else if (_s > S * 0.2 && _s <= S) {
      material.opacity = 1 - (_s - S * 0.2) / (S - S * 0.2)
    } else {
      _s = 1.0
    }
    requestAnimationFrame(waveAnimation)
  }
  waveAnimation()

  return mesh
}
