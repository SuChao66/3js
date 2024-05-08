// 创建地球光圈的渐变动画
export const useEarthCircleTween = (sprite: any) => {
  sprite.fadeIn
    .start()
    .onUpdate((obj: any) => {
      sprite.material.opacity = obj.opacity
    })
    .onComplete(() => {
      sprite.fadeOut
        .start()
        .onUpdate((obj: any) => {
          sprite.material.opacity = obj.opacity
        })
        .onComplete(() => {
          sprite.fadeIn.start()
        })
    })
}
