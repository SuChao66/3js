import * as THREE from 'three'

/**
 * 保存渲染结果
 * @param renderer
 */
export const useSaveFile = ({
  renderer,
  name = 'scene.png',
  type = 'image/png'
}: {
  renderer: THREE.WebGLRenderer
  name?: string
  type?: string
}) => {
  // 创建一个超链接元素，用来下载保存数据的文件
  const link = document.createElement('a')
  // 通过超链接herf属性，设置要保存到文件中的数据
  const canvas = renderer.domElement
  link.href = canvas.toDataURL(type)
  link.download = name
  link.click()
}
