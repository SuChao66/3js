import * as THREE from 'three'
// 导入动画
import * as TWEEN from '@tweenjs/tween.js'

/**
 * 创建NPC消失动画
 */
export const useNpcTween = ({
  npc,
  player,
  duration = 2000
}: {
  npc: any
  player: any
  duration?: number
}) => {
  // 1.获取NPC位置
  const npcPosition = new THREE.Vector3()
  npc.getWorldPosition(npcPosition)
  // 2.获取玩家的方向
  const playerFront = new THREE.Vector3()
  player.getWorldDirection(playerFront)
  // 3.沿着玩家视线方向，设置NPC新位置
  const newNpcPosition = new THREE.Vector3()
  const offsetPosition = playerFront.clone().normalize().multiplyScalar(20)
  newNpcPosition.copy(npcPosition.clone().add(offsetPosition))
  // 4.创建动画
  const npcOutTween = new TWEEN.Tween({
    position: npcPosition
  })
    .to(
      {
        position: newNpcPosition
      },
      duration
    )
    .onUpdate((obj) => {
      npc.position.copy(obj.position)
      // 播放恐怖笑声
      if (!npc.sound.isPlaying) {
        npc.sound.play()
      }
    })
    .start()

  return npcOutTween
}
