import * as THREE from 'three'

/**
 * 创建地面
 * @param scene
 */
export const useGround = (scene: THREE.Scene) => {
  // 1.创建平面几何体
  const geometry = new THREE.PlaneGeometry(6000, 6000)
  // 2.加载纹理贴图
  const texture = new THREE.TextureLoader().load('./texture/瓷砖.jpg')
  // 设置纹理的色彩编码方式
  texture.encoding = THREE.sRGBEncoding
  // 设置阵列
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  // UV两个方向上纹理重复的次数
  texture.repeat.set(12, 12)
  // 3.创建材质
  const material = new THREE.MeshLambertMaterial({
    map: texture
  })
  // 4.创建地面网格模型
  const ground = new THREE.Mesh(geometry, material)
  ground.rotateX(-Math.PI / 2)
  scene.add(ground)
}
