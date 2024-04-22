import * as THREE from 'three'

/**
 * 通过球体设置天空盒（全景）
 * @returns
 */
export const usePanorama = ({
  radius = 500,
  widthSegments = 32,
  heightSegments = 32,
  path,
  scene
}: {
  radius?: number
  widthSegments?: number
  heightSegments?: number
  path: string
  scene: THREE.Scene
}) => {
  const geometry = new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  )
  const texture = new THREE.TextureLoader().load(path)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide
  })
  // 设置纹理贴图编码方式和WebGL渲染器或composer后期伽马修正一致
  material!.map!.encoding = THREE.sRGBEncoding
  const mesh = new THREE.Mesh(geometry, material)

  scene.add(mesh)
}
