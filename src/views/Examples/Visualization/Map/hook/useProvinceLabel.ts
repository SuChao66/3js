import * as THREE from 'three'
// 导入hook
import { useLon2Mercator, useCSS2DObject } from '@/hooks'
import { useTag } from './useTag'

/**
 * 可视化省份行政中心
 * @param param0
 * @returns
 */
export const useProvinceLabel = ({
  path,
  mapSize
}: {
  path: string
  mapSize: number
}) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 定义省份行政中心集合
  const labelGroup = new THREE.Group()
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      data.features.forEach((area: any) => {
        const pos = area.properties.center // 每个省份行政中心位置经纬度
        const name = area.properties.name // 行政中心名称
        if (pos) {
          // 将经纬度转墨卡托坐标
          const { x, y } = useLon2Mercator(pos[0], pos[1])
          // 初始化标签
          const dom = useTag(name)
          const label = useCSS2DObject({ dom })
          label.position.set(x, y, mapSize * 0.02)
          labelGroup.add(label)
        }
      })

      resolve(labelGroup)
    })
  })
}
