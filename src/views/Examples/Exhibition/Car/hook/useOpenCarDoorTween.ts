import * as TWEEN from '@tweenjs/tween.js'

export const useOpenCarDoorTween = (
  axis: string,
  angle1: number,
  angle2: number,
  door: any
) => {
  const state = {
    angle: angle1 // 开始角度
  }
  const tween = new TWEEN.Tween(state)
  tween.to(
    {
      angle: angle2
    },
    1000
  )
  tween.onUpdate(function () {
    // tween动画执行期间.onUpdate()重复执行，更新车门角度
    if (axis == 'y') {
      door.rotation.y = state.angle
    } else {
      door.rotation.z = state.angle
    }
  })

  return tween
}
