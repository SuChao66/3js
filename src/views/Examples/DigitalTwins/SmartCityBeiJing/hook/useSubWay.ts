import * as THREE from 'three'
// 导入hook
import { useLon2Mercator, useLine, useFlowLine } from '@/hooks'
// 导入常量
import { LineType } from '@/enums'

/**
 * 可视化地铁流线
 * @param param0
 */
export const useSubWay = ({ path }: { path: string }) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 线条对象
  const lineGroup = new THREE.Group()
  // 2.加载数据
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      data.geometries.forEach((obj: any) => {
        const pointsArr: number[] = [] // 点数据
        const flypointsArr: number[][] = [] // 流线点数据
        obj.coordinates.forEach((coord: number[]) => {
          // 转换坐标
          const { x, y } = useLon2Mercator(coord[0], coord[1])
          pointsArr.push(x, y, 0)
          flypointsArr.push([x, y])
        })
        // 创建轨迹线
        const line = useLine({
          pointsArr: pointsArr,
          lineType: LineType.Line
        })
        // 创建流线轨迹
        const flowLine = useFlowLine({
          pointsArr: flypointsArr,
          size: 1500
        })
        lineGroup.add(line)
        lineGroup.add(flowLine)
      })
    })
    resolve(lineGroup)
  })
}
