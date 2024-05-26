/**
 * 将经纬度坐标转墨卡托坐标公式
 * @param E
 * @param N
 */
export const useLon2Mercator = (E: number, N: number) => {
  const x = (E * 20037508.34) / 180
  let y = Math.log(Math.tan(((90 + N) * Math.PI) / 360)) / (Math.PI / 180)
  y = (y * 20037508.34) / 180

  return {
    x: x, // 墨卡托x坐标——对应经度
    y: y // 墨卡托y坐标——对应维度
  }
}
