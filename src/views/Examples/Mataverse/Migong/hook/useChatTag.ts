import * as THREE from 'three'
import { useCSS2DObject } from '@/hooks'

/**
 * 创建玩家聊天框
 * @param param0
 * @returns
 */
export const useChatTag = ({
  text = ' hello, who are you ',
  model,
  tagId = 'player-chat-tag'
}: {
  text?: string
  model: THREE.Object3D
  tagId?: string
}) => {
  // 1.创建元素
  const div = document.createElement('div')
  div.className = 'chat-tag'
  div.setAttribute('id', tagId)
  const newContent = document.createTextNode(text)
  div.appendChild(newContent)
  // 2.创建标签
  const tag = useCSS2DObject({
    dom: div
  })
  tag.position.y += 2
  model.add(tag)

  return tag
}
