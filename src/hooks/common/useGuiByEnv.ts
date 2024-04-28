/**
 * 根据环境变量判断是否展示性能监视器
 * @returns
 */
export const useGuiByEnv = () => {
  const VITE_APP_IS_SHOW_GUI = import.meta.env.VITE_APP_IS_SHOW_GUI
  if (VITE_APP_IS_SHOW_GUI === 'true') {
    return true
  } else {
    return false
  }
}
