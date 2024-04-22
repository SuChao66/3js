// 导入THREE
import * as THREE from 'three'

/**
 * 创建渲染器
 * @param canvas 画布
 */
export const useRenderer = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true // 抗锯齿
  })
  // 设置设备像素比
  renderer.setPixelRatio(window.devicePixelRatio)
  // 设置输出画布大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置颜色空间
  renderer.outputEncoding = THREE.sRGBEncoding

  return renderer
}
