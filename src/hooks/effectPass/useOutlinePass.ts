import * as THREE from 'three'
// 引入OutlinePass通道
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'

export const useOutlinePass = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  color: number = 0x00ffff, // 模型描边颜色，默认白色
  edgeThickness: number = 4, // 轮廓边缘描边厚度
  edgeStrength: number = 6, // 边缘发光强度,数值大，更亮一些
  pulsePeriod: number = 2 // 模型闪烁频率，默认0不闪烁
) => {
  let outlinePass: OutlinePass

  const v2 = new THREE.Vector2(window.innerWidth, window.innerHeight)
  outlinePass = new OutlinePass(v2, scene!, camera)
  outlinePass.visibleEdgeColor.set(color)
  outlinePass.edgeThickness = edgeThickness
  outlinePass.edgeStrength = edgeStrength
  outlinePass.pulsePeriod = pulsePeriod

  return {
    outlinePass
  }
}
