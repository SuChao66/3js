import * as THREE from 'three'
// 导入hook
import { useTexture } from '@/hooks'

/**
 * 创建房间
 * @param name 房间名称
 * @param roomIndex 房间下标
 * @param size 房间大小
 * @param texturePath 房间纹理路径
 * @param position 房间坐标
 * @param euler 房间角度
 */
export const useRoom = ({
  name,
  roomIndex,
  size = 10,
  texturePath,
  position = new THREE.Vector3(0, 0, 0),
  euler = new THREE.Euler(0, 0, 0)
}: {
  name: string
  roomIndex: number
  size?: number
  texturePath: string
  position?: THREE.Vector3
  euler?: THREE.Euler
}) => {
  // 创建立方体
  const geometry = new THREE.BoxGeometry(size, size, size)
  geometry.scale(1, 1, -1)
  // 创建材质路径数组
  const texturesPaths = [
    `${roomIndex}_l`, // 左
    `${roomIndex}_r`, // 右
    `${roomIndex}_u`, // 上
    `${roomIndex}_d`, // 下
    `${roomIndex}_b`, // 后
    `${roomIndex}_f` // 前
  ]
  // 创建材质数组
  const boxMaterials: THREE.MeshBasicMaterial[] = []
  // 循环遍历加载材质
  texturesPaths.forEach((path: string) => {
    const texture = useTexture({ path: `${texturePath}${path}.jpg` })
    if (path === `${roomIndex}_d` || path === `${roomIndex}_u`) {
      texture.rotation = Math.PI
      texture.center = new THREE.Vector2(0.5, 0.5)
    }
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      depthTest: true
    })
    boxMaterials.push(material)
  })
  // 创建房间
  const room = new THREE.Mesh(geometry, boxMaterials)
  // 设置房间名称
  room.name = name
  // 设置房间位置
  room.position.copy(position)
  // 设置房间角度
  room.rotation.copy(euler)

  return room
}
