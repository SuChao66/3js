import * as THREE from 'three'
import { useTexture } from '@/hooks'

/**
 * 模拟下雨效果
 * @param N 雨滴数量
 * @param position 位置
 * @param scale 大小
 */
export const useRain = ({
  N = 1500,
  position = new THREE.Vector3(100, 100, 100),
  scale = new THREE.Vector3(0.5, 0.5, 0.5)
}: {
  N?: number
  position?: THREE.Vector3
  scale?: THREE.Vector3
}) => {
  const texture = useTexture({
    path: './images/sprite/rain.png'
  })
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture
  })
  const spriteGroup = new THREE.Group()
  for (let i = 0; i < N; i++) {
    const sprite = new THREE.Sprite(spriteMaterial)
    spriteGroup.add(sprite)
    // 设置精灵模型位置，在长方体空间中随机分布
    const x = position.x * (Math.random() - 0.5)
    const y = position.y * Math.random()
    const z = position.z * (Math.random() - 0.5)
    sprite.position.set(x, y, z)
    sprite.scale.copy(scale)
  }

  return spriteGroup
}
