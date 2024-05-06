import { useCSS2DObject } from '@/hooks'
import * as THREE from 'three'

/**
 * 创建标签
 * @returns
 */
export const useBuildingsTag = (
  buildingsTags: string[],
  model: THREE.Group
) => {
  buildingsTags.forEach((item) => {
    const tagDom = document.getElementById(`${item}_tag`) as HTMLDivElement
    const label = useCSS2DObject({ dom: tagDom })
    const obj = model.getObjectByName(item + '标注')
    obj!.add(label)
  })
}
