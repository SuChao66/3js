import * as THREE from 'three'

export const useScene = () => {
  /**
   * 初始化场景
   */
  const initScene = () => {
    const scene: THREE.Scene = new THREE.Scene()
    return scene
  }

  return {
    initScene
  }
}
