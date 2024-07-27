import * as THREE from 'three'

/**
 * 创建一个位置audio
 * @param param0
 * @returns
 */
export const usePositionAudio = ({
  path,
  volume = 1,
  loop = false,
  distance = 10
}: {
  path: string
  volume?: number
  loop?: boolean
  distance?: number
}) => {
  // 1.创建一个监听者
  const listener = new THREE.AudioListener()
  // 2.创建一个位置音频对象，用来控制播放(声音源)
  const sound = new THREE.PositionalAudio(listener)
  // 3.创建一个音频加载器对象
  const audioLoader = new THREE.AudioLoader()
  // 加载音频
  return new Promise((resolve) => {
    audioLoader.load(path, function (buffer) {
      sound.setBuffer(buffer)
      // 播放音量
      sound.setVolume(volume)
      // 设置距离
      sound.setRefDistance(distance)
      // 设置循环播放
      sound.setLoop(loop)

      resolve(sound)
    })
  })
}
