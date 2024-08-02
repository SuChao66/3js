// 导入动画
import * as TWEEN from '@tweenjs/tween.js'

// 创建动画
export const createTween = ({
  start,
  end,
  tagId
}: {
  start: number
  end: number
  tagId: string
}) => {
  const tween = new TWEEN.Tween({
    opacity: start
  })
    .to({
      opacity: end
    })
    .onUpdate((obj) => {
      const dom = document.getElementById(tagId)
      if (dom) {
        dom.style.opacity = obj.opacity as unknown as string
      }
    })

  return tween
}

export const useChatTagTween = () => {
  // 玩家聊天进入
  const playerChatIn = createTween({
    start: 0,
    end: 1,
    tagId: 'player-chat-tag'
  })

  // 玩家聊天退出
  const playerChatOut = createTween({
    start: 1,
    end: 0,
    tagId: 'player-chat-tag'
  })

  // NPC聊天进入
  const NpcChatIn = createTween({
    start: 0,
    end: 1,
    tagId: 'npc-chat-tag'
  })

  // 玩家聊天退出
  const NpcChatOut = createTween({
    start: 1,
    end: 0,
    tagId: 'npc-chat-tag'
  })

  return {
    playerChatIn,
    playerChatOut,
    NpcChatIn,
    NpcChatOut
  }
}
