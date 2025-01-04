import * as Cesium from 'cesium'

/**
 * 修改地图的影像图层颜色
 * @param viewer
 */
export const useModifyMap = (viewer: Cesium.Viewer) => {
  // 获取地图影像图层
  const basicLayer = viewer.imageryLayers.get(0) as any
  // 设置两个变量，用来判断是否进行颜色的翻转和过滤
  basicLayer.invertColor = true // 翻转颜色
  // 每个颜色分量上减去的值
  basicLayer.filterRGB = [0, 50, 100]

  // 更改地图着色器的代码，baseFragmentShader是一个数组
  const baseFragmentShader = (viewer as any).scene.globe._surfaceShaderSet
    .baseFragmentShaderSource.sources
  // 循环修改着色器
  for (let i = 0; i < baseFragmentShader.length; i++) {
    // console.log(baseFragmentShader[i])
    let strS = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
    // 替换的着色器代码
    let strT = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
    if (basicLayer.invertColor) {
      strT += `
        color.r = 1.0 - color.r;
        color.g = 1.0 - color.g;
        color.b = 1.0 - color.b;
      `
    }
    if (basicLayer.filterRGB) {
      strT += `
        color.r = color.r*${basicLayer.filterRGB[0]}.0/255.0;
        color.g = color.g*${basicLayer.filterRGB[1]}.0/255.0;
        color.b = color.b*${basicLayer.filterRGB[2]}.0/255.0;
      `
    }
    baseFragmentShader[i] = baseFragmentShader[i].replace(strS, strT)
  }
}
