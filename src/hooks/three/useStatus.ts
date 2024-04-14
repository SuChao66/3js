// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'

export const useStatus = () => {
  /**
   * 初始化性能监视器
   * @returns status
   */
  const initStatus = () => {
    const status = new (Status as any)()
    return status
  }

  return {
    initStatus
  }
}
