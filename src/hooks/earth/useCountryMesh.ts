import * as THREE from 'three'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
// 导入hook
import {
  useGridPoint,
  useDelaunator,
  useLon2xyz,
  useBufferGeometry
} from '@/hooks'

/**
 * 创建国家球面网格模型
 * @param R 地球半径
 * @param polygonArr 国家版图经纬度坐标  [[ [], [], [] ]]
 */
export const useCountryMesh = (R: number, polygonArr: number[][]) => {
  // 一个国家多个轮廓，每个轮廓对应的所有几何体
  const geometryArr: THREE.BufferGeometry[] = []

  polygonArr.forEach((obj: any) => {
    // 1.获取多边形轮廓数据polygon
    const polygon = obj[0]
    // 2.根据polygon边界顶点坐标填充点阵，返回边界坐标和填充顶点坐标的并集
    const newPolygonData = useGridPoint(polygon)
    // 3.三角剖分生成顶点坐标对应三角形索引
    const trianglesIndexArr = useDelaunator(newPolygonData, polygon)
    // 4.三角形顶点经纬度坐标转化为球面坐标
    const spherePointsArr: number[] = [] // 所有三角形球面坐标
    newPolygonData.forEach((item) => {
      const { x, y, z } = useLon2xyz(R, item[0], item[1])
      spherePointsArr.push(x, y, z)
    })
    // 5.创建几何体
    const geometry = useBufferGeometry({
      pointsArr: spherePointsArr,
      indexArr: trianglesIndexArr
    })
    geometryArr.push(geometry)
  })

  // 合并几何体
  let newGeometry
  if (geometryArr.length == 1) {
    // 如果一个国家只有一个多边形轮廓，不用进行几何体合并操作
    newGeometry = geometryArr[0]
  } else {
    // 所有几何体合并为一个几何体
    newGeometry = mergeBufferGeometries(geometryArr)
  }
  // 如果使用受光照影响材质，需要计算生成法线
  newGeometry.computeVertexNormals()

  // 创建网格材质
  const material = new THREE.MeshLambertMaterial({
    color: 0x002222
  })
  const mesh = new THREE.Mesh(newGeometry, material)
  return mesh
}
