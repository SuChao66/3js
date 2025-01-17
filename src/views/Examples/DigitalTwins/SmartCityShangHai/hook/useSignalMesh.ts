import * as THREE from 'three'

/**
 * 创建信号波动画
 */
export const useSignalMesh = () => {
  const texLoad = new THREE.TextureLoader()
  const L = 1
  const geometry = new THREE.PlaneGeometry(L, 0.6 * L)
  geometry.translate(-L / 2, 0, 0)
  geometry.rotateZ(Math.PI / 2)
  const material = new THREE.MeshLambertMaterial({
    map: texLoad.load('./images/planets/信号波.png'),
    color: 0x00ffff, //设置颜色
    transparent: true, //允许透明计算
    side: THREE.DoubleSide
  })

  const plane = new THREE.Mesh(geometry, material)
  plane.rotateX(Math.PI / 3)

  // 波动动画
  const S = 1000 //波动范围倍数设置
  let _s = 1
  function animation() {
    _s += 20
    plane.scale.set(_s, _s, _s)
    if (_s <= S * 0.2) {
      // <200
      material.opacity = (_s - 1) / (S * 0.2 - 1) //保证透明度在0~1之间变化
    } else if (_s > S * 0.2 && _s <= S) {
      // 200 - 1000
      material.opacity = 1 - (_s - S * 0.2) / (S - S * 0.2) //保证透明度在0~1之间变化
    } else {
      // >1000
      _s = 1.0
    }
    requestAnimationFrame(animation)
  }
  animation()

  return plane
}
