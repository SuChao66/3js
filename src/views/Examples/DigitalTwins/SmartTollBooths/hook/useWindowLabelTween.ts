import TWEEN from '@tweenjs/tween.js'
// 导入three
import * as THREE from 'three'
// 导入相机控件
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入hook
import { useCameraTween } from '@/hooks'
// 导入常量
import { cameraPos, cameraTarget } from '../constants'

/**
 * 创建窗口收费站相机动画
 * @param model
 * @param camera
 * @param controls
 */
export const useWindowLabelTween = (
  model: THREE.Group,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls
) => {
  for (let i = 0; i < 7; i++) {
    const shoufei = model.getObjectByName('SF00' + (i + 1))
    // 相机的指向
    const target = new THREE.Vector3()
    shoufei?.getWorldPosition(target)
    target.y -= 1
    // 相机的位置
    const pos = new THREE.Vector3()
    pos.set(target.x - 5, target.y + 3, target.z + 10)
    // 创建模型动画
    createCameraTween(
      cameraPos,
      cameraTarget,
      shoufei,
      camera,
      controls,
      pos,
      target
    )
  }
}

/**
 * 给模型创建相机动画
 * @param shoufei
 * @param camera
 * @param controls
 * @param pos
 * @param target
 */
export const createCameraTween = (
  beginPos: THREE.Vector3,
  beginTarget: THREE.Vector3,
  model: any,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  endPos: THREE.Vector3,
  endTarget: THREE.Vector3
) => {
  // 创建进入动画
  const inTween = useCameraTween(beginPos, beginTarget, endPos, endTarget)
  inTween.onUpdate((obj) => {
    // 更新相机的位置
    camera.position.set(obj.x, obj.y, obj.z)
    // 更新相机的target
    camera.lookAt(obj.tx, obj.ty, obj.tz)
    // 更新相机控制器的target
    controls.target.set(obj.tx, obj.ty, obj.tz)
    controls.update()
  })
  model.in = inTween
  // 模型进入渐显效果
  const fadeIn = new TWEEN.Tween({ opacity: 0.0 })
    .to({ opacity: 1.0 }, 2000)
    .onUpdate((obj) => {
      document.getElementById('windowTag')!.style.opacity =
        obj.opacity as unknown as string
    })
  model.fadeIn = fadeIn

  // 创建退出动画
  const outTween = useCameraTween(endPos, endTarget, beginPos, beginTarget)
  outTween.onUpdate((obj) => {
    // 更新相机的位置
    camera.position.set(obj.x, obj.y, obj.z)
    // 更新相机的target
    camera.lookAt(obj.tx, obj.ty, obj.tz)
    // 更新相机控制器的target
    controls.target.set(obj.tx, obj.ty, obj.tz)
    controls.update()
  })
  model.out = outTween
  // 模型退出渐隐效果
  const fadeOut = new TWEEN.Tween({ opacity: 1.0 })
    .to({ opacity: 0.0 }, 2000)
    .onUpdate((obj) => {
      document.getElementById('windowTag')!.style.opacity =
        obj.opacity as unknown as string
    })
  model.fadeOut = fadeOut
}
