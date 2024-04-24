import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer'

export const useCSS3DRenderer = () => {
  const css3Renderer = new CSS3DRenderer()
  // 设置css3Renderer的输出大小
  css3Renderer.setSize(window.innerWidth, window.innerHeight)
  // HTML标签<div id="tag"></div>外面父元素叠加到canvas画布上且重合
  css3Renderer.domElement.style.position = 'absolute'
  css3Renderer.domElement.style.top = '0px'
  //设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
  css3Renderer.domElement.style.pointerEvents = 'none'

  return css3Renderer
}
