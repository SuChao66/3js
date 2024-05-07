/**
 * 地球经纬度转球面坐标
 * @param R 球半径
 * @param longitude 径度
 * @param latitude 纬度
 */
export const useLon2xyz = (R: number, longitude: number, latitude: number) => {
  // 将经纬度转换为弧度值
  let lon = (longitude * Math.PI) / 180 // 经度
  const lat = (latitude * Math.PI) / 180 // 纬度
  // three.js坐标系z坐标轴对应经度-90度，而不是90度，所以需要取反
  lon = -lon

  const x = R * Math.cos(lat) * Math.cos(lon)
  const y = R * Math.sin(lat)
  const z = R * Math.cos(lat) * Math.sin(lon)

  return {
    x,
    y,
    z
  }
}
