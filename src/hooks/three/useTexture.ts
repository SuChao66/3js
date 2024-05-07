import * as THREE from 'three'

/**
 * 初始化纹理贴图
 * @param param0
 * @returns
 */
export const useTexture = ({
  path,
  encoding = THREE.sRGBEncoding
}: {
  path: string
  encoding?: number
}) => {
  const textureLoader = new THREE.TextureLoader()
  const texture = textureLoader.load(path)
  // 设置纹理贴图颜色编码方式
  texture.encoding = encoding

  return texture
}
