import * as THREE from 'three'
import {
  Lensflare,
  LensflareElement
} from 'three/examples/jsm/objects/Lensflare'

export const useCarLight = (scene: THREE.Scene, textureCube: THREE.Texture) => {
  // 1.加载纹理
  const texture = new THREE.TextureLoader().load('./texture/lensflare.jpg')
  // 2.创建两个镜头光晕Lensflare对象，分别用来模拟车前面左右两个车灯的发光效果
  const lensflareElement = new LensflareElement(
    texture,
    600,
    0,
    new THREE.Color(0xffffff)
  )
  const lensflare1 = new Lensflare()
  const lensflare2 = new Lensflare()
  lensflare1.addElement(lensflareElement)
  lensflare2.addElement(lensflareElement)
  // 3.镜头光晕对象隐藏
  lensflare1.visible = false
  lensflare2.visible = false

  const ambient = scene.getObjectByName('环境光') as any
  const driectionalLightLeft = scene.getObjectByName('平行光左') as any
  const driectionalLightRight = scene.getObjectByName('平行光右') as any
  // 前面车灯打开
  function openCarLight() {
    // 镜头光晕对象可见
    lensflare1.visible = true
    lensflare2.visible = true
    // 设置灯光强度，避免车灯效果不明显
    driectionalLightLeft.intensity = 0
    driectionalLightRight.intensity = 0
    ambient.intensity = 0.1
    scene.environment = null
  }
  // 前面车灯关闭
  function closeCarLight() {
    // 镜头光晕对象隐藏
    lensflare1.visible = false
    lensflare2.visible = false
    // 设置灯光强度，避免车灯效果不明显
    driectionalLightLeft.intensity = 0.8
    driectionalLightRight.intensity = 0.8
    ambient.intensity = 0.9
    scene.environment = textureCube
  }

  return {
    lensflare1,
    lensflare2,
    openCarLight,
    closeCarLight
  }
}
