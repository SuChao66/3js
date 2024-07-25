// 导入gltfloader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入dracoloader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

/**
 * 加载模型
 * @param path 模型路径
 * @param isDraco 是否需要解压缩
 */
export const useGLTFModel = ({
  path,
  isDraco = true
}: {
  path: string
  isDraco?: boolean
}) => {
  // 创建dracoLoader
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/gltf/')
  dracoLoader.setDecoderConfig({ type: 'js' })
  dracoLoader.preload()
  // 创建gltfloader
  const loader = new GLTFLoader()
  if (isDraco) {
    loader.setDRACOLoader(dracoLoader)
  }
  return new Promise((resolve) => {
    loader.load(path, (gltf: any) => {
      resolve(gltf)
    })
  })
}
