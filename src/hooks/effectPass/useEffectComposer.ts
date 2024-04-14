import * as THREE from 'three'
// 导入后处理扩展库EffectComposer.js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

/**
 * 创建后处理
 * @param renderer 渲染器
 * @param scene 场景
 * @param camera 相机
 */
export const useEffectComposer = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  // 后处理变量
  let composer: EffectComposer

  // 创建后处理对象EffectComposer，WebGL渲染器作为参数
  composer = new EffectComposer(renderer)
  // 创建一个渲染器通道，场景和相机作为参数
  const renderPass = new RenderPass(scene!, camera)
  composer.addPass(renderPass)

  return {
    composer
  }
}
