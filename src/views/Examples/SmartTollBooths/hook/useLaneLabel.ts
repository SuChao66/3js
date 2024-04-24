import * as THREE from 'three'
// 导入hook
import { useCSS3DObject } from '@/hooks'

/**
 * 创建车道css3D标签
 * @param model
 * @param number
 */
export const useLaneLabel = (model: any, number: number = 8) => {
  for (let i = 0; i < number; i++) {
    // 1.获取对应id车道模型
    const obj = model!.getObjectByName('CD0' + (i + 1))
    // 2.获取车道模型的世界坐标
    const objWorldPosition = new THREE.Vector3()
    obj!.getWorldPosition(objWorldPosition)
    // 2.创建css3标签对象
    const label = useCSS3DObject({
      dom: document.getElementById('CD' + i) as HTMLDivElement,
      position: objWorldPosition,
      offset: new THREE.Vector3(0, 0.6, 0),
      scale: new THREE.Vector3(0.03, 0.03, 0.03)
    })
    // 3.保存到车道标签对象中
    model.add(label)
  }
}
