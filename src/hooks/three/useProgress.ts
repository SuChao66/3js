import * as THREE from 'three'

/**
 * 加载进度管理
 * @param callback 回调函数，将加载进度回调出去
 */
export const useProgress = (callback: Function) => {
  THREE.DefaultLoadingManager.onProgress = (
    item: string,
    loaded: number,
    total: number
  ) => {
    const progress: number = Number(Number((loaded / total) * 100).toFixed(2))

    callback(progress)
  }
}
