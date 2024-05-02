import * as THREE from 'three'

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
   */
  const initDirectionalLight = ({
    color = 0xffffff,
    density = 1,
    position = new THREE.Vector3(0, 0, 0),
    isShowHelper = false,
    scene,
    name = '平行光'
  }: {
    color?: number
    density?: number
    position?: THREE.Vector3
    isShowHelper?: boolean
    scene: THREE.Scene
    name?: string
  }) => {
    const directionalLight = new THREE.DirectionalLight(color, density)
    directionalLight.position.copy(position)
    directionalLight.name = name
    if (isShowHelper) {
      const helper = new THREE.DirectionalLightHelper(
        directionalLight,
        5,
        0xff0000
      )
      scene.add(helper)
    }
    scene.add(directionalLight)
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
