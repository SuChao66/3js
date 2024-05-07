import * as THREE from 'three'
// 导入hook
import { useLine, useShape } from '@/hooks'
// 导入常量
import { LineType } from '@/enums'

// 创建国家边界线
export const createLine = (pointsArr: any[]) => {
  // 一个国家多个轮廓线条line的父对象
  const group = new THREE.Group()
  // 1.对pointsArr进行处理
  pointsArr.forEach((polygon) => {
    const pointArr: number[] = []
    polygon[0].forEach((elem: number[]) => {
      pointArr.push(elem[0], elem[1], 0)
    })
    const line = useLine({ pointsArr: pointArr, lineType: LineType.LineLoop })
    group.add(line)
  })
  return group
}

// 创建国家版图
export const createShape = (pointsArr: any[]) => {
  // 1.定义轮廓形状Shape集合
  const shapes: any[] = []
  // 2.对pointsArr进行遍历
  pointsArr.forEach((polygon) => {
    const vector2Arr: THREE.Vector2[] = []
    polygon[0].forEach((elem: number[]) => {
      vector2Arr.push(new THREE.Vector2(elem[0], elem[1]))
    })
    const shape = new THREE.Shape(vector2Arr)
    shapes.push(shape)
  })

  return useShape({ shapes: shapes })
}

/**
 * 解析word.json数据，生成国家边界线和国家版图
 */
export const useWorldMap = (path: string) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 2.创建一个组对象，用来保存所有国家的边界线和版图模型
  const mapGroup = new THREE.Group()
  // 边界线组对象
  const lineGroup = new THREE.Group()
  lineGroup.position.z += 1 // 适当偏移解决深度冲突，防止某些边界线看不见
  // 版图组对象
  const meshGroup = new THREE.Group()
  mapGroup.add(lineGroup)
  mapGroup.add(meshGroup)
  // 3.加载world.json数据
  return new Promise((resolve, reject) => {
    loader.load(path, (data: any) => {
      // 访问所有国家边界坐标数据：data.features
      data.features.forEach((country: any) => {
        // "Polygon"：国家country有一个封闭轮廓
        if (country.geometry.type === 'Polygon') {
          // 把"Polygon"和"MultiPolygon"的geometry.coordinates数据结构处理为一致
          country.geometry.coordinates = [country.geometry.coordinates]
        }
        const line = createLine(country.geometry.coordinates)
        const mesh = createShape(country.geometry.coordinates)
        lineGroup.add(line)
        meshGroup.add(mesh)
      })

      resolve(mapGroup)
    })
  })
}
