import * as THREE from 'three'
// 导入FontLoader
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

export const useFont = ({
  path,
  color = 0xffffff,
  text,
  fontSize = 10
}: {
  path: string
  color?: number
  text: string
  fontSize?: number
}) => {
  const fontLoader = new FontLoader()

  return new Promise((resolve, reject) => {
    fontLoader.load(path, (font: any) => {
      const material = new THREE.MeshLambertMaterial({
        color: color,
        side: THREE.DoubleSide
      })
      // .generateShapes()：获得字符'720°'的轮廓顶点坐标
      const Shapes = font.generateShapes(text, fontSize)
      const geometry = new THREE.ShapeGeometry(Shapes)
      const textMesh = new THREE.Mesh(geometry, material)

      resolve(textMesh)
    })
  })
}
