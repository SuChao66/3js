import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { Object3D } from 'three'

const link = document.createElement('a')
link.style.display = 'none'
const save = (blob: any, filename: string) => {
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
}

/**
 * 导出GLTF模型
 * @param input
 */
export const useExportGLTF = (input: Object3D | Object3D[]) => {
  const gltfExporter = new GLTFExporter()
  const options = {
    trs: false,
    onlyVisible: true,
    truncateDrawRange: true,
    binary: true, //是否导出.gltf的二进制格式.glb  控制导出.gltf还是.glb
    forceIndices: false,
    forcePowerOfTwoTextures: false
  }
  gltfExporter.parse(
    input,
    (result: ArrayBuffer | { [key: string]: any }) => {
      if (result instanceof ArrayBuffer) {
        save(
          new Blob([result], { type: 'application/octet-stream' }),
          'scene.glb'
        )
      } else {
        const output = JSON.stringify(result, null, 2)
        save(new Blob([output], { type: 'text/plain' }), 'scene.gltf')
      }
    },
    (error) => {
      console.error(error)
    },
    options
  )
}
