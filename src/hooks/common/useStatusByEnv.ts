/**
 * 根据环境变量判断是否展示性能监视器
 * @returns
 */
export const useStatusByEnv = () => {
  const VITE_APP_IS_SHOW_STATUS = import.meta.env.VITE_APP_IS_SHOW_STATUS
  if (VITE_APP_IS_SHOW_STATUS === 'true') {
    return true
  } else {
    return false
  }
}
