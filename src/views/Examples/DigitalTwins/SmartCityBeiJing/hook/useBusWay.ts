import * as THREE from 'three'
// 导入hook
import { useLon2Mercator, useLine, useFlowLine } from '@/hooks'
// 导入常量
import { LineType } from '@/enums'

export const useBusWay = ({ path }: { path: string }) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 线条对象
  const lineGroup = new THREE.Group()
  // 2.加载数据
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      data.coordinates.forEach((obj: any, index: number) => {
        // 避免性能影响，只渲染50条公交路线
        if (index > 50) return
        const pointsArr: number[] = [] // 点数据
        const flypointsArr: number[][] = [] // 流线点数据
        for (let i = 0; i < obj.length; i += 2) {
          // 转换坐标
          const { x, y } = useLon2Mercator(obj[i], obj[i + 1])
          pointsArr.push(x, y, 0)
          flypointsArr.push([x, y])
        }
        // 创建轨迹线
        const line = useLine({
          pointsArr: pointsArr,
          lineType: LineType.Line,
          color: new THREE.Color(0xff00ff)
        })
        // 创建流线轨迹
        const flowLine = useFlowLine({
          pointsArr: flypointsArr,
          size: 1000,
          startColor: new THREE.Color(0x87cefa),
          endColor: new THREE.Color(0x00ffff)
        })
        lineGroup.add(line)
        lineGroup.add(flowLine)
      })
    })
    resolve(lineGroup)
  })
}
