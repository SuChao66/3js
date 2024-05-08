import * as THREE from 'three'
// 导入hook
import { useLon2xyz, usePoints, useSort } from '@/hooks'
// 导入常量
import { earthRadius, color1, color2 } from '../constants'

export const useEarthPoints = (path: string) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 机场组对象
  const group = new THREE.Group()
  // 2.加载数据
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      const coordArr = data.points // 所有经纬度坐标数据
      const numArr = data.num // 所有点对应周边点数
      // 数组复制并排序，然后获得最大值
      const numMax = numArr.slice().sort(useSort)[numArr.length - 1]
      // 定义所有顶点数据
      const vertices: number[] = []
      // 所有顶点颜色数据
      const colorsArr: number[] = []
      // 对机场经纬度数据进行处理
      for (let i = 0; i < coordArr.length; i++) {
        // 将经纬度坐标转换为球坐标
        if (coordArr[i] && coordArr[i + 1]) {
          const { x, y, z } = useLon2xyz(
            earthRadius * 1.001,
            coordArr[i],
            coordArr[i + 1]
          )
          vertices.push(x, y, z)
          // 颜色插值计算
          let percent = (numArr[i / 2] / numMax) * 100
          if (percent > 1.0) percent = 1.0
          const color = color1.clone().lerp(color2.clone(), percent)
          colorsArr.push(color.r, color.g, color.b)
        }
      }
      // 生成点模型
      const point = usePoints({
        pointsArr: vertices,
        colorsArr: colorsArr,
        isVertexColors: true
      })
      group.add(point)
      resolve(group)
    })
  })
}
