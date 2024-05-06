import * as THREE from 'three'

export const useCommunityMaterial = (model: THREE.Group) => {
  // 1.模型投射阴影
  model.traverse((obj: any) => {
    if (obj.type === 'Mesh') {
      // 设置产生投影的网格模型
      obj.castShadow = true
      // 设置接收阴影的投影面
      obj.receiveShadow = true
    }
  })
  // 2.批量处理树
  const treeGroup = model.getObjectByName('树')
  treeGroup?.traverse((obj: any) => {
    if (obj.type === 'Mesh') {
      // 调节树的金属度、粗糙度，降低交叉mesh因反光带来的视觉瑕疵
      obj.material.metalness = 0.0
      obj.material.roughness = 1.0
      obj.material.reflectivity = 0.0
    }
  })
  // 3.河流流动
  const waterMesh = model.getObjectByName('river') as any
  waterMesh!.material.transparent = true
  waterMesh!.material.opacity = 0.7
  const map = waterMesh!.material.map
  // 4.处理窗户
  const windows = model.getObjectByName('窗户') as any
  windows.layers.enable(1)
  model.traverse((obj: any) => {
    if (obj.type === 'Mesh') {
      // 相同材质，统一改变layers
      if (obj.material == windows.material) {
        obj.layers.enable(1)
      }
    }
  })

  return {
    map
  }
}
