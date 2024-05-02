// 导入hook
import { useAudio } from '@/hooks'

/**
 * 创建背景音乐
 * @returns
 */
export const useBgMusic = () => {
  const backgroundAudio = useAudio({
    path: './voice/bg.wav',
    volume: 0.2,
    loop: true
  })

  return backgroundAudio
}
