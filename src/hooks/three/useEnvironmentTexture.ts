import * as THREE from 'three'

/**
 * 环境贴图
 * @param param0
 */
export const useEnvironmentTexture = ({ path }: { path: string }) => {
  const texture = new THREE.CubeTextureLoader()
    .setPath(path)
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
  return texture
}
