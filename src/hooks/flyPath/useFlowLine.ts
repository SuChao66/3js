import * as THREE from 'three'
// 导入shader
import { flowline_output_fragement } from '@/shaders'

/**
 * 使用三维样条曲线生成流线
 * @param pointsArr 曲线点坐标
 * @param N 分段数
 * @param startColor 开始渐变色
 * @param endColor 结束渐变色
 * @param size 点的大小
 */
export const useFlowLine = ({
  pointsArr,
  N = 100,
  size = 5.0,
  startColor = new THREE.Color(0x666600),
  endColor = new THREE.Color(0xffff00)
}: {
  pointsArr: number[][]
  N?: number
  size?: number
  startColor?: THREE.Color
  endColor?: THREE.Color
}) => {
  // 1.数据处理
  const pointsV3: THREE.Vector3[] = []
  pointsArr.forEach((coord: number[]) => {
    pointsV3.push(new THREE.Vector3(coord[0], coord[1], 0))
  })

  // 2.创建三维样条曲线
  const curve = new THREE.CatmullRomCurve3(pointsV3)

  // 3.曲线上等间距返回多个顶点坐标
  const points = curve.getSpacedPoints(N)

  // 4.定义点索引位置和从曲线上获取点数量
  let index = 20
  const num = 15

  // 5.获取曲线上部分点，作为流线的点
  const flowPoints = points.slice(index, index + num)
  // 创建流线
  const flowCurve = new THREE.CatmullRomCurve3(flowPoints)
  // 获取更多的流线点
  const newFlowPoints = flowCurve.getSpacedPoints(N)

  // 6.创建几何体
  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints(newFlowPoints)
  // 给每一个顶点设置一个一个百分比，控制点的大小
  const percentArr = []
  const half = Math.floor(newFlowPoints.length / 2)
  const colorArr = []
  for (let i = 0; i < newFlowPoints.length; i++) {
    if (i < half) {
      percentArr.push(i / half)
      const color1 = startColor //轨迹线颜色 青色
      const color2 = endColor //更亮青色
      const color = color1.lerp(color2, i / half)
      colorArr.push(color.r, color.g, color.b)
    } else {
      percentArr.push(1 - (i - half) / half)
      const color1 = endColor //更亮青色
      const color2 = startColor //轨迹线颜色 青色
      const color = color1.lerp(color2, (i - half) / half)
      colorArr.push(color.r, color.g, color.b)
    }
  }
  // 设置几何体顶点大小
  ;(geometry.attributes as any).percent = new THREE.BufferAttribute(
    new Float32Array(percentArr),
    1
  )
  // 设置几何体顶点颜色数据
  ;(geometry.attributes as any).color = new THREE.BufferAttribute(
    new Float32Array(colorArr),
    3
  )
  // 创建点材质
  const pointMaterial = new THREE.PointsMaterial({
    size: size,
    vertexColors: true,
    transparent: true, //开启透明计算
    depthTest: false
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
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <output_fragment>',
      flowline_output_fragement
    )
  }
  const flowLine = new THREE.Points(geometry, pointMaterial)

  // 飞线动画
  const indexMax = points.length - num //飞线取点索引范围
  function animation() {
    if (index > indexMax) index = 0
    index += 1
    const flowPoints = points.slice(index, index + num) //从曲线上获取一段
    const flowCurve = new THREE.CatmullRomCurve3(flowPoints)
    const newFlowPoints = flowCurve.getSpacedPoints(N) //获取更多的点数
    geometry.setFromPoints(newFlowPoints)

    requestAnimationFrame(animation)
  }
  animation()

  return flowLine
}
