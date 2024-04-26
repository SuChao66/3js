import { useCSS3DSprite } from '@/hooks'
import * as THREE from 'three'

const tag = (size: number) => {
  const div = document.getElementById('carTag') as HTMLDivElement
  div.style.pointerEvents = 'none'
  const style = window.getComputedStyle(div)
  const width = style.getPropertyValue('width')
  const w = Number(width.split('px')[0])
  const scale = new THREE.Vector3(size / w, size / w, size / w)
  const label = useCSS3DSprite({
    dom: div,
    scale
  })

  return label
}

/**
 * 创建车的标签
 * @param order
 * @returns
 */
export const useCarTag = (order: number) => {
  //创建标签对象
  let label = null
  if (order > 4) {
    label = tag(5.0)
  } else {
    label = tag(4.0)
  }

  return label
}
