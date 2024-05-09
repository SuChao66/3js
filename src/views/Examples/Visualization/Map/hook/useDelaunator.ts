import * as THREE from 'three'
// 导入hook
import { useBufferGeometry, useTriangularCenter } from '@/hooks'
// 三角剖分
import Delaunator from 'delaunator'
// 多边形轮廓数据
import polygonData from '../data/polygonData.js'
// 导入point-in-polygon
import { nested as pointInPolygonNested } from 'point-in-polygon'

/**
 * 对多边形轮廓内的数据进行三角剖分
 * @param points: 多边形轮廓内经纬度点坐标(包括轮廓上的点)
 * @param pos: 多边形轮廓内点
 */
export const useDelaunator = (points: number[][]) => {
  // 处理polygonPointsArr，作为几何体顶点坐标
  const posArr: number[] = []
  points.forEach(function (elem) {
    posArr.push(elem[0], elem[1], 0)
  })
  // console.log('points:', points)

  // 三角剖分
  //.from(pointsArr).triangles：平面上一系列点集三角剖分，并获取三角形索引值
  const indexArr = Delaunator.from(points).triangles
  // console.log('indexArr:', indexArr)

  // 过滤indexArr，去除多边形轮廓外的索引
  // 删除多边形polygon外面三角形，判断方法非常简单，判断一个三角形的质心是否在多边形轮廓内部
  const usefulIndexArr: number[] = []
  for (let i = 0; i < indexArr.length; i += 3) {
    // 三角形三个顶点坐标p1, p2, p3
    const p1 = points[indexArr[i]]
    const p2 = points[indexArr[i + 1]]
    const p3 = points[indexArr[i + 2]]
    // 三角形重心坐标计算
    const center = useTriangularCenter(p1, p2, p3)
    if (pointInPolygonNested(center, polygonData)) {
      usefulIndexArr.push(indexArr[i + 2], indexArr[i + 1], indexArr[i])
    }
  }

  const meshGroup = new THREE.Group()
  const geometry = useBufferGeometry({
    pointsArr: posArr,
    indexArr: usefulIndexArr
  })
  const material = new THREE.MeshBasicMaterial({
    color: 0x004444
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.z = -0.01

  // 渲染三角形线框
  // const mesh2 = mesh.clone()
  // mesh2.material = new THREE.MeshBasicMaterial({
  //   color: 0x009999,
  //   wireframe: true
  // })

  meshGroup.add(mesh)

  return meshGroup
}
