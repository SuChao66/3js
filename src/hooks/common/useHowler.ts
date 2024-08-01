import { Howl } from 'howler'

/**
 * 使用howler播放器
 * @param src 音频地址
 * @param autoplay 是否自动播放
 * @param loop 是否循环播放
 * @param volume 音量 0 - 1
 */
export const useHowler = ({
  src,
  autoplay = false,
  loop = true,
  volume = 1
}: {
  src: string
  autoplay?: boolean
  loop?: boolean
  volume?: number
}) => {
  return new Promise((resolve) => {
    const sound = new Howl({
      src: [src],
      autoplay,
      loop,
      volume
    })

    sound.once('load', function () {
      resolve(sound)
    })

    sound.on('end', function () {
      console.log('Finished!')
    })
  })
}
