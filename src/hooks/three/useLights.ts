import * as THREE from 'three'

interface ICastShadowCameraConfig {
  near: number
  far: number
  left: number
  right: number
  top: number
  bottom: number
  mapSizeW?: number
  mapSizeH?: number
  radius?: number
}

export const useLights = () => {
  /**
   * 创建环境光
   * @param color 颜色
   * @param density 强度
   * @param scene 场景
   */
  const initAmbientLight = ({
    density = 0.4,
    scene,
    name = '环境光'
  }: {
    density?: number
    scene: THREE.Scene
    name?: string
  }) => {
    const ambient = new THREE.AmbientLight(0xffffff, density)
    ambient.name = name
    scene.add(ambient)
  }

  /**
   * 创建平行光
   * @param color 颜色
   * @param density 强度
   * @param position 位置
   * @param isShowHelper 是否显示光源辅助器
   * @param scene 场景
   * @param name 光源名称
   * @param isCastShadow 是否投射阴影
   * @param castShadowCameraConfig: 阴影区域参数设置
   * @param isShowCameraHelper: 是否显示相机阴影辅助器
   */
  const initDirectionalLight = ({
    color = 0xffffff,
    density = 1,
    position = new THREE.Vector3(0, 0, 0),
    isShowHelper = false,
    scene,
    name = '平行光',
    isCastShadow = false,
    castShadowCameraConfig = {
      near: 0.5,
      far: 3000,
      left: -500,
      right: 500,
      top: 500,
      bottom: -500,
      mapSizeW: 1024 * 4,
      mapSizeH: 1024 * 4,
      radius: 3
    },
    isShowCameraHelper = false
  }: {
    color?: number
    density?: number
    position?: THREE.Vector3
    isShowHelper?: boolean
    scene: THREE.Scene
    name?: string
    isCastShadow?: boolean
    castShadowCameraConfig?: ICastShadowCameraConfig
    isShowCameraHelper?: boolean
  }) => {
    // 0.创建平行光
    const directionalLight = new THREE.DirectionalLight(color, density)
    directionalLight.position.copy(position)
    directionalLight.name = name
    scene.add(directionalLight)
    // 1.是否旋转光源辅助器
    if (isShowHelper) {
      const helper = new THREE.DirectionalLightHelper(
        directionalLight,
        5,
        0xff0000
      )
      scene.add(helper)
    }
    // 2.是否投射阴影
    if (isCastShadow) {
      // 设置用于计算阴影的光源对象
      directionalLight.castShadow = true
      // 设置计算阴影的区域，最好刚好紧密包围在对象周围
      // 计算阴影的区域过大：模糊  过小：看不到或显示不完整
      directionalLight.shadow.camera.near = castShadowCameraConfig.near
      directionalLight.shadow.camera.far = castShadowCameraConfig.far
      directionalLight.shadow.camera.left = castShadowCameraConfig.left
      directionalLight.shadow.camera.right = castShadowCameraConfig.right
      directionalLight.shadow.camera.top = castShadowCameraConfig.top
      directionalLight.shadow.camera.bottom = castShadowCameraConfig.bottom
      // 为了清晰度，提升阴影贴图的尺寸
      if (castShadowCameraConfig.mapSizeW) {
        directionalLight.shadow.mapSize.width = castShadowCameraConfig.mapSizeW
      }
      if (castShadowCameraConfig.mapSizeH) {
        directionalLight.shadow.mapSize.height = castShadowCameraConfig.mapSizeH
      }
      // 模糊阴影的边缘
      if (castShadowCameraConfig.radius) {
        directionalLight.shadow.radius = castShadowCameraConfig.radius
      }
    }
    // 3.可视化相机阴影
    if (isShowCameraHelper) {
      // 可视化平行光阴影对应的正投影相机对象
      const cameraHelper = new THREE.CameraHelper(
        directionalLight.shadow.camera
      )
      scene.add(cameraHelper)
    }
  }

  /**
   * 创建点光源
   * @param color 颜色
   * @param density 强度
   * @param distance 距离
   * @param decay 衰减程度
   * @param position 点光源位置
   * @param isShowHelper 是否显示光源辅助器
   * @param scene 场景
   */
  const initPointLight = ({
    color = 0xffffff,
    density = 1,
    distance = 100,
    decay = 2,
    position = new THREE.Vector3(0, 0, 0),
    isShowHelper = false,
    scene,
    name = '点光源'
  }: {
    color?: number
    density?: number
    distance?: number
    decay?: number
    position?: THREE.Vector3
    isShowHelper?: boolean
    scene: THREE.Scene
    name?: string
  }) => {
    const pointLight = new THREE.PointLight(color, density, distance, decay)
    pointLight.position.copy(position)
    pointLight.name = name
    if (isShowHelper) {
      const pointLightHelper = new THREE.PointLightHelper(
        pointLight,
        1,
        0xffff00
      )
      scene.add(pointLightHelper)
    }
    scene.add(pointLight)
  }

  return {
    initAmbientLight,
    initDirectionalLight,
    initPointLight
  }
}
