import * as THREE from 'three'

/**
 * 加载canvas纹理
 * @param imageSrc 图片地址
 * @param text 文字
 * @returns
 */
export const useCanvasTexture = ({
  imageSrc,
  text
}: {
  imageSrc: string
  text: string
}) => {
  // 1.创建canvas对象
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  // 2.获取上下文
  const context = canvas.getContext('2d')!
  // 3.加载背景图片
  let texture
  const image = new Image()
  image.src = imageSrc
  return new Promise((resolve) => {
    image.onload = () => {
      context.drawImage(image, 0, 0, 1024, 1024)
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = 'bold 80px Arial'
      context.fillStyle = 'rgba(0,255,255,1)'
      context.fillText(text, canvas.width / 2, canvas.height / 2)

      // 4.加载纹理
      texture = new THREE.CanvasTexture(canvas)
      resolve(texture)
    }
  })
}
