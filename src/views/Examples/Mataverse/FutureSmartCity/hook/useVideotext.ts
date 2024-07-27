import * as THREE from 'three'

/**
 * 创建视频背景的文字
 */
export const useVideotext = ({
  videoSrc,
  text = 'Hello World',
  position = new THREE.Vector3(0, 0, 0),
  euler = new THREE.Euler(0, 0, 0),
  size = new THREE.Vector2(1, 1)
}: {
  videoSrc: string
  text?: string
  position?: THREE.Vector3
  euler?: THREE.Euler
  size?: THREE.Vector2
}) => {
  // 1.创建canvas
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  // 2.创建video
  const video = document.createElement('video')
  video.src = videoSrc
  // 如果想要视频能够自动播放，那么就设置为静音
  video.muted = true
  video.loop = true
  video.play()
  // 3.获取上下文
  const context = canvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(canvas)
  // 创建几何体平面
  const planeGeometry = new THREE.PlaneGeometry(size.x, size.y * (2 / 3), 1, 1)
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    alphaMap: texture,
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
  const mesh = new THREE.Mesh(planeGeometry, planeMaterial)
  mesh.position.copy(position)
  mesh.rotation.copy(euler)
  mesh.visible = false

  const drawVideoText = (text: string) => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(video, 0, 0, 512, 512)
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = 'bold 45px Arial'
    context.fillStyle = 'rgba(0,255,255,1)'
    context.fillText(text, canvas.width / 2, canvas.height / 2)
    texture.needsUpdate = true
    planeMaterial.needsUpdate = true
  }

  const update = () => {
    drawVideoText(text)
  }

  return {
    update,
    mesh
  }
}
