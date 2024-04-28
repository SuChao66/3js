import * as THREE from 'three'
// 导入hook
import { useSprite } from '@/hooks'

/**
 * 创建精灵图
 * @param param0
 */
export const usePointsTag = ({ model, path }: { model: any; path: string }) => {
  const sprite = useSprite({
    path: path,
    scale: new THREE.Vector3(6, 6, 1),
    animation: true,
    Smax: 6
  })
  // 获取后置摄像头的世界坐标
  const worldPosition = new THREE.Vector3()
  model!.getWorldPosition(worldPosition)
  // 设置精灵图的位置
  const spritePosition = worldPosition.add(new THREE.Vector3(-4, 0, -3))
  sprite.position.copy(spritePosition)

  return sprite
}
