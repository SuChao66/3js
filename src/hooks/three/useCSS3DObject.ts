import * as THREE from 'three'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

/**
 * 创建CSS3D标签对象
 * @param dom 标签元素
 * @param position 标签位置
 * @param offset 标签偏移量
 * @param scale 标签大小
 * @returns
 */
export const useCSS3DObject = ({
  dom,
  position = new THREE.Vector3(0, 0, 0),
  offset = new THREE.Vector3(0, 0, 0),
  scale = new THREE.Vector3(1, 1, 1)
}: {
  dom: HTMLDivElement
  position: THREE.Vector3
  offset: THREE.Vector3
  scale: THREE.Vector3
}) => {
  // 创建css3D标签对象
  const label = new CSS3DObject(dom)
  // 设置标签的位置坐标
  const pos = new THREE.Vector3()
  pos.addVectors(position, offset)
  // 设置标签的坐标
  label.position.copy(pos)
  // 设置标签的大小
  label.scale.copy(scale)

  return label
}
