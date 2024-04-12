import * as THREE from 'three'

export const useLights = () => {
  /**
   * 创建环境光
   * @param color 颜色
   * @param density 强度
   * @returns
   */
  const initAmbientLight = (density: number = 0.4) => {
    const ambient = new THREE.AmbientLight(0xffffff, density)
    return ambient
  }

  /**
   * 创建平行光
   * @param color 颜色
   * @param density 强度
   * @param direction 方向
   * @returns
   */
  const initDirectionalLight = (
    color: number = 0xffffff,
    density: number = 1,
    direction: number[] = [100, 60, 50]
  ) => {
    const directionalLight = new THREE.DirectionalLight(color, density)
    const x = direction[0]
    const y = direction[1]
    const z = direction[2]
    directionalLight.position.set(x, y, z)
    return directionalLight
  }

  /**
   * 创建点光源
   * @param color 颜色
   * @param density 强度
   * @param distance 距离
   * @param decay 衰减程度
   */
  const initPointLight = (
    color: number = 0xffffff,
    density: number = 1,
    distance: number = 100,
    decay: number = 2
  ) => {
    new THREE.PointLight(color, density, distance, decay)
  }

  return {
    initAmbientLight,
    initDirectionalLight,
    initPointLight
  }
}
