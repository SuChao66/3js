import * as THREE from 'three'

/**
 * 创建射线拾取器，用来拾取场景中的模型
 * @param x 鼠标x坐标
 * @param y 鼠标y坐标
 * @param camera 相机
 * @param chooseObjArr 模型
 * @returns
 */
export const useRayCaster = ({
  x = 0,
  y = 0,
  camera,
  chooseObjArr
}: {
  x: number
  y: number
  camera: THREE.PerspectiveCamera
  chooseObjArr: THREE.Group | any
}) => {
  // 1.创建一个射线拾取器
  const raycaster = new THREE.Raycaster()
  //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
  // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
  // 射线交叉计算拾取模型
  const intersects = raycaster.intersectObjects(chooseObjArr, true)

  let choose = null
  if (intersects.length > 0) {
    choose = intersects[0].object
  }
  return choose
}
