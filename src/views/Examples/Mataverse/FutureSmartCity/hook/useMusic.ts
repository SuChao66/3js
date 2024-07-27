import * as THREE from 'three'
// 导入hook
import { usePositionAudio } from '@/hooks'

/**
 * 听音乐
 * @param param0
 */
export const useMusic = async ({
  position = new THREE.Vector3(0, 0, 0),
  path
}: {
  position?: THREE.Vector3
  path: string
}) => {
  // 1.创建音频
  const sound = (await usePositionAudio({
    path,
    loop: true
  })) as any

  return new Promise((resolve) => {
    // 1.创建一个平面，用来承载音频源
    const geometry = new THREE.PlaneGeometry(0.1, 0.1)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(position)
    // 播放音频
    sound.play()
    mesh.add(sound)

    resolve({ mesh, sound })
  })
}
