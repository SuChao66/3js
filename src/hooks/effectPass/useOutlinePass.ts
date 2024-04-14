import * as THREE from 'three'
// 引入OutlinePass通道
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'

export const useOutlinePass = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  color: number = 0x00ffff,
  edgeThickness: number = 4,
  edgeStrength: number = 6
) => {
  let outlinePass: OutlinePass

  const v2 = new THREE.Vector2(window.innerWidth, window.innerHeight)
  outlinePass = new OutlinePass(v2, scene!, camera)
  outlinePass.visibleEdgeColor.set(color)
  outlinePass.edgeThickness = edgeThickness
  outlinePass.edgeStrength = edgeStrength

  return {
    outlinePass
  }
}
