import * as THREE from 'three'
// 导入RGBELoader
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

/**
 * 创建天空盒
 * @param path 文件地址
 */
export const useHdr = ({
  path,
  scene
}: {
  path: string
  scene: THREE.Scene
}) => {
  // 初始化hdr加载器
  const hdrLoader = new RGBELoader()
  hdrLoader.load(path, (texture: THREE.Texture) => {
    // 设置图像将如何应用到物体（对象）上，像圆一样四周环绕整个场景
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  })
}
