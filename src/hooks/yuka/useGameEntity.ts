import * as THREE from 'three'
import * as YUKA from 'yuka'

const callback = (entity: any, renderComponent: any) => {
  renderComponent.position.copy(entity.position)
  renderComponent.quaternion.copy(entity.rotation)
}

/**
 * 创建目标实体
 * @param param0
 * @returns
 */
export const useGameEntity = ({
  renderComponent,
  position = new THREE.Vector3(0, 0, 0)
}: {
  renderComponent: THREE.Mesh
  position: THREE.Vector3
}) => {
  // 1.创建目标：游戏实体
  const target = new YUKA.GameEntity()
  // 2.设置目标渲染对象
  target.setRenderComponent(renderComponent, callback)
  // 3.设置目标实体的初始位置
  target.position.set(position.x, position.y, position.z)

  return target
}
