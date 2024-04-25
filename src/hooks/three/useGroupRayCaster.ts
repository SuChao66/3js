import * as THREE from 'three'

/**
 * 创建射线拾取器，用来拾取场景中的模型，并标注到父对象中
 * @param x 鼠标x坐标
 * @param y 鼠标y坐标
 * @param camera 相机
 * @param dom 模型
 * @returns
 */
export const useGroupRayCaster = ({
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
  // 射线拾取组group或Object3D方法：
  // 1.intersectObject或intersectObjects的参数2，设置true，计算组的所有后代mesh
  // 2.1.如果要拾取的对象所有后代只有1个层级，可以通过拾取的mesh的父对象名字，判断那个组对象被选中了
  // 2.2.如果要拾取的对象所有后代只有1个以上层级，可以给对象所有子孙后代mesh，设置一个祖先father属性指向祖先
  for (let i = 0; i < chooseObjArr.length; i++) {
    const group = chooseObjArr[i]
    //递归遍历chooseObj，并给chooseObj的所有子孙后代设置一个ancestors属性指向自己
    group.traverse(function (obj: any) {
      obj.ancestors = group
    })
  }
  if (intersects.length > 0) {
    choose = (intersects[0].object as any).ancestors
  }
  return choose
}
