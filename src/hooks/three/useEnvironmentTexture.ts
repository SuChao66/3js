import * as THREE from 'three'

/**
 * 环境贴图
 * @param param0
 */
export const useEnvironmentTexture = ({ path }: { path: string }) => {
  const texture = new THREE.CubeTextureLoader()
    .setPath(path)
    .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'])
  return texture
}
