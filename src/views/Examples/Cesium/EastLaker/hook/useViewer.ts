import * as Cesium from 'cesium'
// 导入常量
import { leiFengTaPosition, tk, tianDiTuUrl } from '../constants'

/**
 * 初始化查看器
 * @param dom
 * @returns
 */
export const useViewer = (dom: HTMLDivElement | null) => {
  // 设置默认视角：中国
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    // 西边的经度
    89.5,
    // 南边的维度
    20.4,
    // 东边的经度
    110.4,
    // 北边的维度
    61.2
  )

  // 创建查看器
  const viewer = new Cesium.Viewer(dom as HTMLElement, {
    // 是否显示信息窗口
    infoBox: false,
    // 是否显示右上角搜索框，可以搜索任何一个地方
    geocoder: false,
    // 是否显示右上角home按钮
    homeButton: false,
    // 是否显示右上角3D、2D、2.5D的切换（显示模式）
    sceneModePicker: false,
    // 是否显示右上角图层选择器
    baseLayerPicker: false,
    // 是否显示右上角帮助按钮
    navigationHelpButton: false,
    // 是否显示底下的动画播放按钮
    animation: false,
    // 是否显示底下的时间轴
    timeline: false,
    // 是否现实全屏按钮
    fullscreenButton: false,
    // 取消天空盒显示
    skyBox: false
  })
  // 隐藏查看器底下的  logo
  ;(viewer.cesiumWidget.creditContainer as any).style.display = 'none'

  // 设置场景
  // 允许光照
  viewer.scene.globe.enableLighting = true
  // 设置背景为黑色
  viewer.scene.backgroundColor = Cesium.Color.BLACK
  // 设置抗锯齿
  viewer.scene.postProcessStages.fxaa.enabled = true

  // 设置影像图层
  const imageryLayers = viewer.imageryLayers
  const basicImagery = new Cesium.WebMapTileServiceImageryProvider({
    url: `${tianDiTuUrl}?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${tk}`,
    layer: 'tdtBasicLayer',
    style: 'default',
    format: 'image/ipeg',
    tileMatrixSetID: 'GoogleMapsCompatible'
  })
  imageryLayers.addImageryProvider(basicImagery)

  // 设置矢量地图（高德矢量地图）
  // const layer = imageryLayers.addImageryProvider(
  //   new Cesium.UrlTemplateImageryProvider({
  //     url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
  //   })
  // )
  // // 设置图层的透明度（避免影像图看不见）
  // layer.alpha = 0.2

  // 设置雷峰塔经纬度
  const position = Cesium.Cartesian3.fromDegrees(
    leiFengTaPosition.longitude,
    leiFengTaPosition.latitude,
    leiFengTaPosition.height
  )
  viewer.camera.flyTo({
    destination: position,
    orientation: {
      heading: Cesium.Math.toRadians(-45),
      pitch: Cesium.Math.toRadians(-45),
      roll: 0
    },
    duration: 2
  })

  return viewer
}
