import * as THREE from 'three'
// 导入hook
import { useLon2Mercator } from '@/hooks'

/**
 * 创建平面上的两个点之间的飞线
 * @param param0
 * @returns
 */
export const useCatmullRomFlyPath = ({
  start,
  end,
  color = 0x00ffff,
  N = 100,
  isAnimation = false
}: {
  start: number[]
  end: number[]
  color?: number
  N?: number
  isAnimation?: boolean
}) => {
  const { x: x1, y: y1 } = useLon2Mercator(start[0], start[1])
  const { x: x2, y: y2 } = useLon2Mercator(end[0], end[1])
  const startV = new THREE.Vector3(x1, y1, 0)
  const endV = new THREE.Vector3(x2, y2, 0)
  // 求两个点的中点
  const middleV = new THREE.Vector3(0, 0, 0)
  middleV.add(startV).add(endV).divideScalar(2)
  // 根据两点之间的距离计算轨迹线高度
  const L = startV.clone().sub(endV).length()
  const H = L * 0.2
  middleV.z += H
  // 创建样条曲线
  const geometry = new THREE.BufferGeometry()
  const curve = new THREE.CatmullRomCurve3([startV, middleV, endV])
  // 曲线上等间距返回多个顶点坐标
  const points = curve.getSpacedPoints(N) //分段数100，返回101个顶点
  // setFromPoints方法从points中提取数据赋值给attributes.position
  geometry.setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color: color //轨迹颜色
  })
  //线条模型对象
  const line = new THREE.Line(geometry, material)

  // 创建飞线动画
  let flyLine: any
  if (isAnimation) {
    let index = 0 // 取点索引位置
    const num = 10 // 从曲线上获取点数量
    let points2 = points.slice(index, index + num) // 从曲线上获取一段
    const curve = new THREE.CatmullRomCurve3(points2) // 创建一个短的样条曲线
    const newPoints2 = curve.getSpacedPoints(100) // 获取更多的点数
    const geometry2 = new THREE.BufferGeometry()
    geometry2.setFromPoints(newPoints2)

    // 每个顶点对应一个百分比数据attributes.percent 用于控制点的渲染大小
    const percentArr = [] // attributes.percent的数据
    for (let i = 0; i < newPoints2.length; i++) {
      percentArr.push(i / newPoints2.length)
    }
    const percentAttribue = new THREE.BufferAttribute(
      new Float32Array(percentArr),
      1
    )
    geometry2.attributes.percent = percentAttribue

    // 批量计算所有顶点颜色数据
    const colorArr = []
    for (var i = 0; i < newPoints2.length; i++) {
      const color1 = new THREE.Color(0x006666) //轨迹线颜色 青色
      const color2 = new THREE.Color(0xffff00) //黄色
      const color = color1.lerp(color2, i / newPoints2.length)
      colorArr.push(color.r, color.g, color.b)
    }
    // 设置几何体顶点颜色数据
    geometry2.attributes.color = new THREE.BufferAttribute(
      new Float32Array(colorArr),
      3
    )

    // 点模型渲染
    const PointsMaterial = new THREE.PointsMaterial({
      size: 5.0, //点大小
      vertexColors: true //使用顶点颜色渲染
    })
    // 修改点材质的着色器源码(注意：不同版本细节可能会稍微会有区别，不过整体思路是一样的)
    PointsMaterial.onBeforeCompile = function (shader) {
      // 顶点着色器中声明一个attribute变量:百分比
      shader.vertexShader = shader.vertexShader.replace(
        'void main() {',
        [
          'attribute float percent;', //顶点大小百分比变量，控制点渲染大小
          'void main() {'
        ].join('\n') // .join()把数组元素合成字符串
      )
      // 调整点渲染大小计算方式
      shader.vertexShader = shader.vertexShader.replace(
        'gl_PointSize = size;',
        ['gl_PointSize = percent * size;'].join('\n') // .join()把数组元素合成字符串
      )
    }
    flyLine = new THREE.Points(geometry2, PointsMaterial)
    line.add(flyLine)

    const indexMax = N - num // 飞线取点索引范围
    const render = () => {
      if (index > indexMax) index = 0
      index += 1
      points2 = points.slice(index, index + num)
      const curve = new THREE.CatmullRomCurve3(points2)
      const newPoints2 = curve.getSpacedPoints(100) //获取更多的点数
      geometry2.setFromPoints(newPoints2)

      requestAnimationFrame(render)
    }
    render()
  }

  return line
}
