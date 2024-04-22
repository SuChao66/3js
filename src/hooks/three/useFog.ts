import * as THREE from 'three'

export const useFog = () => {
  /**
   * 初始化雾化效果
   * @param color
   * @param density
   */
  const initFog = ({
    color = 0xffffff,
    near = 1,
    far = 1000,
    scene
  }: {
    color?: number
    near?: number
    far?: number
    scene: THREE.Scene
  }) => {
    const fog = new THREE.Fog(color, near, far)
    scene.fog = fog
  }

  /**
   * 创建指数雾
   * @param color
   * @param density
   * @returns
   */
  const initFogExp2 = ({
    color = 0xffffff,
    density = 0.0025,
    scene
  }: {
    color?: number
    density?: number
    scene: THREE.Scene
  }) => {
    const fog = new THREE.FogExp2(color, density)
    scene.fog = fog
  }

  return {
    initFog,
    initFogExp2
  }
}
