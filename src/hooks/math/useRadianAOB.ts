import * as THREE from 'three'

/**
 * 计算球面上两点和球心构成夹角的弧度值，参数point1, point2:表示地球球面上两点坐标Vector3
 * 计算A、B两点和顶点O构成的AOB夹角弧度值
 * @param A
 * @param B
 * @param O
 * @returns
 */
export const useRadianAOB = (
  A: THREE.Vector3,
  B: THREE.Vector3,
  O: THREE.Vector3
) => {
  // 构建向量：球面上两个点和球心构成的方向向量
  const OA = A.clone().sub(O).normalize() // 向量OA
  const OB = B.clone().sub(O).normalize() // 向量OB
  // 点乘.dot()计算夹角余弦值
  const cosAngle = OA.clone().dot(OB)
  const radianAngle = Math.acos(cosAngle)

  return radianAngle
}
