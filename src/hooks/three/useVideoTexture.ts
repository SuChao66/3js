import * as THREE from 'three'

/**
 * 加载视频纹理
 * @param videoSrc 视频地址
 * @returns
 */
export const useVideoTexture = ({ videoSrc }: { videoSrc: string }) => {
  // 1.创建video
  const video = document.createElement('video')
  video.src = videoSrc
  // 如果想要视频能够自动播放，那么就设置为静音
  video.muted = true
  video.loop = true
  video.play()
  // 2.创建video纹理
  const texture = new THREE.VideoTexture(video)

  return texture
}
