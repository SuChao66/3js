import * as THREE from 'three'

/**
 * 创建文本精灵
 * @param text 文本
 * @param position 精灵所处的位置
 */
export const useCanvasSprite = ({
  text,
  position = new THREE.Vector3(0, 0, 0),
  scale = new THREE.Vector3(1, 1, 1)
}: {
  text: string
  position?: THREE.Vector3
  scale?: THREE.Vector3
}) => {
  // 创建canvas对象
  const canvas = document.createElement('canvas')
  // 设置canvas的宽高
  canvas.width = 1024
  canvas.height = 1024
  // 获取上下文
  const context = canvas.getContext('2d')!
  // 设置canvas标签样式
  context.fillStyle = 'rgba(100, 100, 100, 0.7)'
  context.fillRect(0, 256, 1024, 512)
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = 'bold 200px Arial'
  context.fillStyle = 'rgba(255,255,255,1)'
  context.fillText(text, canvas.width / 2, canvas.height / 2)

  // 创建canvas纹理
  const texture = new THREE.CanvasTexture(canvas)
  // 创建精灵材质
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true
  })
  // 创建精灵
  const sprite = new THREE.Sprite(material)
  // 设置精灵的大小
  sprite.scale.copy(scale)
  // 设置精灵的位置
  sprite.position.copy(position)
  // 设置精灵的名称
  sprite.name = text

  return sprite
}
