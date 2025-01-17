import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'

export const useCSS2DRenderer = () => {
  const css2Renderer = new CSS2DRenderer()
  // 设置输出画布大小
  css2Renderer.setSize(window.innerWidth, window.innerHeight)
  // HTML标签<div id="tag"></div>外面父元素叠加到canvas画布上且重合
  css2Renderer.domElement.style.position = 'absolute'
  css2Renderer.domElement.style.top = '0px'
  //设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
  css2Renderer.domElement.style.pointerEvents = 'none'

  return css2Renderer
}
