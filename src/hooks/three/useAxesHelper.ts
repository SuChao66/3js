import * as THREE from 'three'

export const useAxesHelper = () => {
  /**
   * 初始化观察坐标系
   * @param size 大小
   */
  const initHelper = (size: number = 50) => {
    return new THREE.AxesHelper(size)
  }

  return {
    initHelper
  }
}
