import TWEEN from '@tweenjs/tween.js'

/**
 * 创建挡杆抬起/关闭的动画
 * @param model
 * @param duration
 */
export const useDangGanTween = (model: any, duration: number = 2000) => {
  // 2.创建挡杆抬起来的动画
  const openTween = new TWEEN.Tween({ angle: 0 })
  openTween.to({ angle: Math.PI / 2 }, duration)
  openTween.onUpdate(function (obj) {
    model.rotation.z = obj.angle
  })
  model.openTween = openTween

  // 3.创建挡杆放下来的动画
  const closeTween = new TWEEN.Tween({ angle: Math.PI / 2 })
  closeTween.to({ angle: 0 }, duration)
  closeTween.onUpdate(function (obj) {
    model.rotation.z = obj.angle
  })
  model.closeTween = closeTween
}
