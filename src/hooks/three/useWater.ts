import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water2.js'

/**
 * 创建水流的效果
 * @radius 半径
 * @segments 细分数
 * @color 水的颜色
 * @scale 水纹的缩放大小
 * @position 位置
 * @rotation 旋转角度
 */
export const useWater = ({
  radius = 100,
  segments = 32,
  color = 0x08dbea,
  scale = 50,
  position = new THREE.Vector3(0, 0, 0),
  rotation = new THREE.Euler(0, 0, 0)
}: {
  radius?: number
  segments?: number
  color?: number
  scale?: number
  position?: THREE.Vector3
  rotation?: THREE.Euler
}) => {
  // 1.创建几何体
  const waterGeometry = new THREE.CircleGeometry(radius, segments)
  // 2.创建水
  const water = new Water(waterGeometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    color: color,
    flowDirection: new THREE.Vector2(1, 1),
    scale: scale
  })
  // 3.设置水平面的位置
  water.position.copy(position)
  // 4.设置水平面的角度
  water.rotation.copy(rotation)

  return water
}
