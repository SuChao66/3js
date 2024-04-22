// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'

/**
 * 初始化性能监视器
 * @returns status
 */
export const useStatus = () => {
  const status = new (Status as any)()
  return status
}
