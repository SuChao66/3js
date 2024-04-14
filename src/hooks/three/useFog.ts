import * as THREE from 'three'

export const useFog = () => {
  /**
   * 初始化雾化效果
   * @param color
   * @param density
   */
  const initFog = (
    color: number = 0xffffff,
    near: number = 1,
    far: number = 1000
  ) => {
    const fog = new THREE.Fog(color, near, far)
    return fog
  }

  /**
   * 创建指数雾
   * @param color
   * @param density
   * @returns
   */
  const initFogExp2 = (color: number = 0xffffff, density: number = 0.0025) => {
    const fog = new THREE.FogExp2(color, density)
    return fog
  }

  return {
    initFog,
    initFogExp2
  }
}
