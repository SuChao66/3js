import TWEEN from '@tweenjs/tween.js'

// 正向车道车辆动画
export const useCarTween = (car: any, TagDom: HTMLDivElement) => {
  // 1.车辆进站停止动画
  const stopTween = new TWEEN.Tween({ z: 40, opacity: 0.0 })
  stopTween.to({ z: 15, opacity: 1.0 }, 3000)
  stopTween.onUpdate((obj) => {
    car.position.z = obj.z
    TagDom.style.opacity = obj.opacity as unknown as string
  })
  car.stop = stopTween

  // 2.车辆出站开走动画
  const runTween = new TWEEN.Tween({ z: 15, opacity: 1.0 })
  runTween.to({ z: -200, opacity: 0.0 }, 10000)
  runTween.onUpdate((obj) => {
    car.position.z = obj.z
    TagDom.style.opacity = obj.opacity as unknown as string
  })
  car.run = runTween
}

// 对向车道车辆动画
export const useCarTweenFan = (car: any, TagDom: HTMLDivElement) => {
  // 车站进站停止动画
  const stopTween = new TWEEN.Tween({ z: -100, opacity: 0.0 })
  stopTween.to({ z: -15, opacity: 1.0 }, 3000)
  stopTween.onUpdate((obj) => {
    car.position.z = obj.z
    TagDom.style.opacity = obj.opacity as unknown as string
  })
  car.stop = stopTween //车模型自定义一个属性绑定自己对应的动画

  //  车辆出站开走动画
  const runTween = new TWEEN.Tween({ z: -15, opacity: 1.0 })
  runTween.to({ z: 40, opacity: 0.0 }, 3000)
  runTween.onUpdate((obj) => {
    car.position.z = obj.z
    TagDom.style.opacity = obj.opacity as unknown as string
  })
  car.run = runTween
}
