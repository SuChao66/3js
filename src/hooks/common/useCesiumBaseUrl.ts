/**
 * 在不同的 base 路径下（vite.config.ts 中的 base 配置
 * 尤其是开发模式用的是拷贝来的 CesiumJS 库文件，最好拼接上 base 路径
 * 生产模式使用 CDN 则不用拼接 base 路径
 * @returns
 */
export const useCesiumBaseUrl = () => {
  // 基础地址
  const sysBaseUrl = import.meta.env.VITE_BASE_URL
  // 开发模式
  // const mode = import.meta.env.MODE
  // cesium基础地址
  const sourceCesiumBaseUrl = import.meta.env.VITE_CESIUM_BASE_URL

  const cesiumBaseUrl = `${sysBaseUrl}${sourceCesiumBaseUrl}`

  return cesiumBaseUrl
}
