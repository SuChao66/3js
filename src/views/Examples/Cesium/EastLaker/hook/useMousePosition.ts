import * as Cesium from 'cesium'

/**
 * 根据鼠标位置，获取经纬度值
 * @param viewer
 */
export const useMousePoition = (
  viewer: Cesium.Viewer,
  dom: HTMLDivElement | null
) => {
  let divDom: HTMLDivElement | null = null
  if (!divDom) {
    divDom = document.createElement('div')
    divDom.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      width: 210px;
      height: 40px;
      line-height:40px;
      text-align: center;
      padding: 0 10px;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 5px;
      color: #fff;
      z-index: 100;
    `
    dom?.appendChild(divDom)
  }

  // 监听鼠标的移动事件
  const handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handle.setInputAction((movement: any) => {
    // 获取鼠标的坐标
    const cartesian = viewer.camera.pickEllipsoid(
      movement.endPosition,
      viewer.scene.globe.ellipsoid
    )
    // 转换成经纬度坐标
    if (cartesian) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
      const longitudeString = Cesium.Math.toDegrees(
        cartographic.longitude
      ).toFixed(2)
      const latitudeString = Cesium.Math.toDegrees(
        cartographic.latitude
      ).toFixed(2)
      divDom!.innerHTML = `经度：${longitudeString}，纬度：${latitudeString}`
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}
