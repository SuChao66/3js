import * as THREE from 'three'
// 导入hook
import { useTexture, useLon2xyz } from '@/hooks'
// 导入常量
import { earthRadius } from '../constants'
// 导入TWEEN
import * as TWEEN from '@tweenjs/tween.js'

/**
 * 创建地球表面标注点的动画
 * @param sprite
 */
export const useMarkPointTween = (sprite: any) => {
  sprite.zoomIn
    .start()
    .onUpdate((obj: any) => {
      sprite.scale.set(obj.scale, obj.scale, obj.scale)
      sprite.material.opacity = obj.opacity
    })
    .onComplete(() => {
      sprite.zoomOut
        .start()
        .onUpdate((obj: any) => {
          sprite.scale.set(obj.scale, obj.scale, obj.scale)
          sprite.material.opacity = obj.opacity
        })
        .onComplete(() => {
          sprite.zoomIn.start()
        })
    })
}

/**
 * 使用标注点，标注指定地点
 * @param R 地球半径
 * @param lon 经度
 * @param lat 纬度
 * @param color 颜色
 * @param duration 动画默认时长
 * @param minScale 模型最小缩放
 * @param maxScale 模型最大缩放
 * @param isAnimation 是否执行动画
 */
export const useMarkPoint = ({
  path,
  lon,
  lat,
  color = 0x22ffcc,
  duration = 1500,
  minScale = 0.15,
  maxScale = 0.2,
  isAnimation = true
}: {
  path: string
  lon: number
  lat: number
  color?: number
  duration?: number
  maxScale?: number
  minScale?: number
  isAnimation?: boolean
}) => {
  // 1.加载精灵
  const texture = useTexture({ path: path })
  // 2.创建平面几何体
  const geometry = new THREE.PlaneGeometry(1, 1)
  // 3.创建材质
  const material = new THREE.MeshBasicMaterial({
    color: color,
    map: texture,
    transparent: true,
    depthWrite: false
  })
  const mesh = new THREE.Mesh(geometry, material) as any
  const size = earthRadius * minScale // 矩形平面Mesh的尺寸
  mesh.scale.set(size, size, size) // 设置mesh大小
  // 4.创建标注点动画
  if (isAnimation) {
    const zoomIn = new TWEEN.Tween({
      scale: earthRadius * minScale,
      opacity: 0.2
    }).to({ scale: earthRadius * maxScale, opacity: 1.0 }, duration)
    const zoomOut = new TWEEN.Tween({
      scale: earthRadius * maxScale,
      opacity: 1.0
    }).to({ scale: earthRadius * minScale, opacity: 0.2 }, duration)
    mesh.zoomIn = zoomIn
    mesh.zoomOut = zoomOut
    useMarkPointTween(mesh)
  }
  // 5.经纬度转球面坐标，将精灵图设置在地球表面
  const { x, y, z } = useLon2xyz(earthRadius * 1.001, lon, lat)
  mesh.position.set(x, y, z)
  // 6.设置精灵图的角度
  // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
  const coordVec3 = new THREE.Vector3(x, y, z).normalize()
  const meshNormal = new THREE.Vector3(0, 0, 1)
  //.setFromUnitVectors();计算两个向量之间构成的四元数值
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)

  return mesh
}
