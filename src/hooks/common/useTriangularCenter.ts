/**
 * 获取三角形的重心坐标
 * @param p1
 * @param p2
 * @param p3
 */
export const useTriangularCenter = (
  p1: number[],
  p2: number[],
  p3: number[]
) => {
  const center = [(p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3]

  return center
}
