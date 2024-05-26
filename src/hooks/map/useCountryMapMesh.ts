import * as THREE from 'three'
// 导入hook
import { useShape, useExtrude, useLon2Mercator } from '@/hooks'

/**
 * 创建地图填充几何体
 * @param coordinates
 * @returns
 */
export const useCountryMapMesh = ({
  coordinates,
  isExtruded = false,
  height = 2.0
}: {
  coordinates: number[][]
  isExtruded?: boolean
  height?: number
}) => {
  // 1.轮廓形状shape的集合
  const shapes: THREE.Shape[] = []
  // 2.对数据进行遍历处理
  coordinates.forEach((polygon: any) => {
    const vector2Arr: any[] = []
    polygon[0].forEach((point: any) => {
      // 经纬度转墨卡托坐标
      const { x, y } = useLon2Mercator(point[0], point[1])
      vector2Arr.push(new THREE.Vector2(x, y))
    })
    const shape = new THREE.Shape(vector2Arr)
    shapes.push(shape)
  })
  // 3.生成几何体
  let mesh = null
  if (isExtruded) {
    mesh = useExtrude({ shapes: shapes, height: height })
  } else {
    mesh = useShape({
      shapes: shapes
    })
  }
  return mesh
}
