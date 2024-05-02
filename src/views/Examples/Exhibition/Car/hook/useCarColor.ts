import * as THREE from 'three'

/**
 * 设置车辆外壳颜色
 * @param model
 * @param color
 */
export const useCarColor = (model: THREE.Group, color: number | string) => {
  model.traverse((obj: any) => {
    if (obj.type === 'Mesh') {
      if (obj.name.slice(0, 2) == '外壳') {
        obj.material.color.set(color)
      }
    }
  })
}
