import * as THREE from 'three'
// 导入hook
import { useLon2Mercator } from '@/hooks'

/**
 * 根据顶点坐标创建建筑物
 * @param pointsArr
 * @param height 楼高
 * @param isExtruded 是否拉伸
 */
export const useBuild = ({
  pointsArrs,
  height = 0,
  isExtruded = false
}: {
  pointsArrs: number[][]
  height?: number
  isExtruded?: boolean
}) => {
  const shapes: THREE.Shape[] = []

  pointsArrs.forEach((pointsArr: any) => {
    const vertor2Arr: THREE.Vector2[] = []
    pointsArr[0].forEach((elem: number[]) => {
      // 经纬度转墨卡托坐标
      const { x, y } = useLon2Mercator(elem[0], elem[1])
      vertor2Arr.push(new THREE.Vector2(x, y))
    })
    const shape = new THREE.Shape(vertor2Arr)
    shapes.push(shape)
  })

  let geometry
  // 创建拉伸几何体
  if (isExtruded) {
    geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: height, //拉伸高度
      bevelEnabled: false // 无倒脚
    })
  } else {
    // 创建填充几何体
    geometry = new THREE.ShapeGeometry(shapes)
  }

  return geometry
}
