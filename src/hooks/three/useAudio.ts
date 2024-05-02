import * as THREE from 'three'

/**
 * 创建audio
 * @param param0
 * @returns
 */
export const useAudio = ({
  path,
  volume = 0.5,
  loop = false
}: {
  path: string
  volume?: number
  loop?: boolean
}) => {
  // 1.创建一个监听者
  const listener = new THREE.AudioListener()
  // 2.创建一个非位置音频对象，用来控制播放
  const sound = new THREE.Audio(listener)
  // 3.创建一个音频加载器对象
  const audioLoader = new THREE.AudioLoader()
  // 加载音频
  audioLoader.load(path, function (buffer) {
    sound.setBuffer(buffer)
    // 播放音量
    sound.setVolume(volume)
    // 设置循环播放
    sound.setLoop(loop)
  })

  return sound
}
