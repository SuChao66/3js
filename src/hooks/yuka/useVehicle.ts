import * as THREE from 'three'
import * as YUKA from 'yuka'

const callback = (entity: any, renderComponent: any) => {
  renderComponent.position.copy(entity.position)
  renderComponent.quaternion.copy(entity.rotation)
}

/**
 * 创建vehicle
 * @param speed 速度
 * @param renderComponent 对应的渲染模型
 * @returns
 */
export const useVehicle = ({
  speed = 5,
  renderComponent
}: {
  speed?: number
  renderComponent: THREE.Mesh
}) => {
  const vehicle = new YUKA.Vehicle()
  // 设置vehicle的速度
  vehicle.maxSpeed = speed
  // 设置vehicle对应的渲染模型，绑定模型和vehicle
  vehicle.setRenderComponent(renderComponent, callback)

  return vehicle
}
