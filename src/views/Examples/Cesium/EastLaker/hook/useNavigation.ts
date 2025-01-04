import * as Cesium from 'cesium'
// 导入CesiumNavigation
import CesiumNavigation from 'cesium-navigation-es6'

/**
 * 初始化导航罗盘
 * @param viewer
 */
export const useNavigation = (viewer: Cesium.Viewer) => {
  // 设置导航罗盘的配置
  const options = {
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。
    enableCompass: true,
    // 用于启用或禁用缩放控件
    enableZoomControls: true,
    // 用于启用或禁用距离图例
    enableDistanceLegend: true,
    // 用于启用或禁用指南针外环
    enableCompassOuterRing: true,
    // 修改重置视图的tooltip
    resetTooltip: '重置试图',
    // 修改放大按钮的tooltip
    zoomInTooltip: '放大',
    // 修改缩小按钮的tooltip
    zoomOutTooltip: '缩小'
  }
  // 初始化导航罗盘
  new CesiumNavigation(viewer, options)
}
