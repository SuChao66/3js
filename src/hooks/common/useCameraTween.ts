import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

/**
 * 创建相机动画
 * @param beginPos 相机开始的位置
 * @param beginTarget 相机开始的朝向
 * @param endPos 相机结束的位置
 * @param endtarget 相机结束的朝向
 * @returns 动画实例
 */
export const useCameraTween = (
  beginPos: THREE.Vector3,
  beginTarget: THREE.Vector3,
  endPos: THREE.Vector3,
  endtarget: THREE.Vector3,
  duration: number = 2000
) => {
  const tween = new TWEEN.Tween({
    // 相机的开始位置
    x: beginPos.x,
    y: beginPos.y,
    z: beginPos.z,
    // 相机的开始朝向
    tx: beginTarget.x,
    ty: beginTarget.y,
    tz: beginTarget.z
  })
    .to(
      {
        // 动画结束相机的位置坐标
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        // 动画结束相机的target坐标
        tx: endtarget.x,
        ty: endtarget.y,
        tz: endtarget.z
      },
      duration
    )
    .easing(TWEEN.Easing.Sinusoidal.InOut) //使用二次缓动函数
  return tween
}
