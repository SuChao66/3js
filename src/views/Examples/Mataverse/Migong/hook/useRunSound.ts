// 导入hook
import { usePositionAudio } from '@/hooks'

export const useRunSound = async ({ path }: { path: string }) => {
  // 1.创建音频
  const sound = (await usePositionAudio({
    path,
    loop: true,
    volume: 2
  })) as any

  return sound
}
