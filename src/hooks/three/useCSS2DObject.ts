import * as THREE from 'three'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

/**
 * 创建CSS2D标签对象
 * @param dom 标签元素
 * @param position 标签位置
 * @param offset 标签偏移量
 * @param scale 标签大小
 * @returns
 */
export const useCSS2DObject = ({ dom }: { dom: HTMLDivElement }) => {
  // 创建css3D标签对象
  const label = new CSS2DObject(dom)

  return label
}
