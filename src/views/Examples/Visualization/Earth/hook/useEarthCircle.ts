import * as THREE from 'three'
// 导入hook
import { useTexture } from '@/hooks'
import { useEarthCircleTween } from './'
// 导入常量
import { earthRadius } from '../constants'
// 导入TWEEN
import * as TWEEN from '@tweenjs/tween.js'

/**
 * 创建地球光圈
 * @param path
 * @returns
 */
export const useEarthCircle = (path: string) => {
  // 1.加载纹理
  const texture = useTexture({ path: path })
  // 2.创建精灵材质
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.0
  })
  // 3.创建精灵
  const sprite = new THREE.Sprite(material) as any
  sprite.scale.set(earthRadius * 3.0, earthRadius * 3.0, earthRadius)
  // 4.创建精灵动画
  const fadeIn = new TWEEN.Tween({ opacity: 0.0 }).to({ opacity: 1.0 }, 1500)
  const fadeOut = new TWEEN.Tween({ opacity: 1.0 }).to({ opacity: 0.0 }, 1500)
  sprite.fadeIn = fadeIn
  sprite.fadeOut = fadeOut
  // 5.播放动画
  useEarthCircleTween(sprite)

  return sprite
}
