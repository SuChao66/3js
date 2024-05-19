import * as THREE from 'three'

/**
 * 绘制一条圆弧飞线
 * @param R 圆弧半径
 * @param startEngle 开始角度
 * @param endEngle 结束角度
 */
export const useFlyLine = (R: number, startEngle: number, endEngle: number) => {
  // 创建几何体
  const geometry = new THREE.BufferGeometry()
  // 创建圆弧曲线
  const arc = new THREE.ArcCurve(0, 0, R, startEngle, endEngle, false)
  // 获取曲线上的点
  const points = arc.getSpacedPoints(50)
  geometry.setFromPoints(points)
  // 给每一个顶点设置一个一个百分比，控制点的大小
  const percentArr = []
  for (let i = 0; i < points.length; i++) {
    percentArr.push(i / points.length)
  }
  const percentAttribute = new THREE.BufferAttribute(
    new Float32Array(percentArr),
    1
  )
  ;(geometry.attributes as any).percent = percentAttribute
  // 批量计算所有顶点颜色数据
  const colorArr = []
  for (let i = 0; i < points.length; i++) {
    const color1 = new THREE.Color(0x006666)
    const color2 = new THREE.Color(0xffff00)
    const color = color1.clone().lerp(color2.clone(), i / points.length)
    colorArr.push(color.r, color.g, color.b)
  }
  // 设置几何体顶点颜色数据
  ;(geometry.attributes as any).color = new THREE.BufferAttribute(
    new Float32Array(colorArr),
    3
  )
  // 创建点材质
  const pointMaterial = new THREE.PointsMaterial({
    size: 5.0,
    vertexColors: true
  })
  // 修改点材质的着色器源码
  pointMaterial.onBeforeCompile = (shader) => {
    // console.log(shader)
    // 顶点着色器中声明一个attribute变量：百分比
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      ['attribute float percent;', 'void main() {'].join('\n')
    )
    shader.vertexShader = shader.vertexShader.replace(
      'gl_PointSize = size',
      ['gl_PointSize = percent * size'].join('\n')
    )
  }
  const flyLine = new THREE.Points(geometry, pointMaterial)

  return flyLine
}
