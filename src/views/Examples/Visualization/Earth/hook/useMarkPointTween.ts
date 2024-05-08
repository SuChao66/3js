/**
 * 创建地球表面标注点的动画
 * @param sprite
 */
export const useMarkPointTween = (sprite: any) => {
  sprite.zoomIn
    .start()
    .onUpdate((obj: any) => {
      sprite.scale.set(obj.scale, obj.scale, obj.scale)
    })
    .onComplete(() => {
      sprite.zoomOut
        .start()
        .onUpdate((obj: any) => {
          sprite.scale.set(obj.scale, obj.scale, obj.scale)
        })
        .onComplete(() => {
          sprite.zoomIn.start()
        })
    })
}
