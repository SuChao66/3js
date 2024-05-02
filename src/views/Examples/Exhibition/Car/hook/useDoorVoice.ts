// 导入hook
import { useAudio } from '@/hooks'

/**
 * 创建开门/关门声音播放器
 */
export const useDoorVoice = () => {
  // 开门
  const openSound = useAudio({
    path: './voice/open.wav',
    volume: 0.5,
    loop: false
  })
  // 关门
  const closeSound = useAudio({
    path: './voice/close.wav',
    volume: 0.5,
    loop: false
  })

  return {
    openSound,
    closeSound
  }
}
