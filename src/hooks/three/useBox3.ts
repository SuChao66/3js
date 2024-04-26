import * as THREE from 'three'

/**
 * 创建model的包围盒
 * @param model
 */
export const useBox3 = ({
  model,
  helper = false
}: {
  model: any
  helper?: boolean
}) => {
  // 1.创建包围盒
  const box3 = new THREE.Box3()
  box3.expandByObject(model)

  // 2.获取包围盒的尺寸
  const size = new THREE.Vector3()
  box3.getSize(size)

  // 3.获取包围盒的中心
  const center = new THREE.Vector3()
  box3.getCenter(center)

  // 4.创建包围盒辅助对象
  if (helper) {
    const boxHelper = new THREE.Box3Helper(box3)
    model.add(boxHelper)
  }

  return {
    size,
    center
  }
}
