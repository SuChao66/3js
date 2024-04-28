import * as THREE from 'three'

/**
 * 场景精灵图
 * @param param0
 */
export const useSprite = ({
  path,
  scale = new THREE.Vector3(1.0, 1.0, 1.0),
  color = new THREE.Color(0x00ffff),
  animation = false,
  Smax = 0.6
}: {
  path: string
  scale?: THREE.Vector3
  color?: THREE.Color
  animation?: boolean
  Smax?: number
}) => {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load(path),
    transparent: true,
    color: color
  })
  const sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.copy(scale)

  // 设置标注精灵Sprite波动，提示用户点击
  let s = 0.0
  function waveAnimation() {
    s += 0.01
    if (s < 0.5) {
      sprite.scale.x = Smax * (1 + s)
      sprite.scale.y = Smax * (1 + s)
    } else if (s >= 0.5 && s < 1.0) {
      sprite.scale.x = Smax * (2 - s)
      sprite.scale.y = Smax * (2 - s)
    } else {
      s = 0.0
    }

    requestAnimationFrame(waveAnimation)
  }
  animation && waveAnimation()

  return sprite
}
