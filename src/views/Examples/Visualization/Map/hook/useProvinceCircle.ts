import * as THREE from 'three'
// 导入hook
import { useLon2Mercator } from '@/hooks'
// 导入TWEEN
import * as TWEEN from '@tweenjs/tween.js'

// 矩形平面网格模型设置背景透明的png贴图
const geometry = new THREE.PlaneGeometry(1, 1)
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./images/planets/circle.png')
const material = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  map: texture,
  transparent: true // 使用背景透明的png贴图，注意开启透明计算
})

/**
 * 创建城市热点
 * @param size 热点大小
 * @param x 热点位置x
 * @param y 热点位置y
 * @param z 热点位置z
 * @returns
 */
const cityPointMesh = (size: number, x: number, y: number, z: number) => {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.scale.set(size, size, size) //设置mesh大小
  mesh.position.set(x, y, z) //设置mesh位置

  return mesh
}

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
 * 可视化省份行政中心光圈
 * @param param0
 * @returns
 */
export const useProvinceCircle = ({
  path,
  mapSize,
  minScale = 0.02,
  maxScale = 0.06,
  duration = 1000,
  isAnimation = false
}: {
  path: string
  mapSize: number
  minScale?: number
  maxScale?: number
  duration?: number
  isAnimation?: boolean
}) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 定义省份行政中心集合
  const provinceCircleGroup = new THREE.Group()
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      data.features.forEach((area: any) => {
        const pos = area.properties.center // 每个省份行政中心位置经纬度
        if (pos) {
          const size = mapSize * 0.04
          const z = mapSize * 0.025
          // 将经纬度转墨卡托坐标
          const { x, y } = useLon2Mercator(pos[0], pos[1])
          // 生成行政中心mesh
          const mesh = cityPointMesh(size, x, y, z) as any
          mesh._s = size
          // 创建波动动画
          if (isAnimation) {
            const zoomIn = new TWEEN.Tween({
              scale: mapSize * minScale,
              opacity: 0.5
            }).to(
              {
                scale: mapSize * maxScale,
                opacity: 1.0
              },
              (Math.random() * 1 + 2) * duration
            )
            const zoomOut = new TWEEN.Tween({
              scale: mapSize * maxScale,
              opacity: 1.0
            }).to(
              {
                scale: mapSize * minScale,
                opacity: 0.2
              },
              (Math.random() * 1 + 2) * duration
            )
            mesh.zoomIn = zoomIn
            mesh.zoomOut = zoomOut
            // 执行动画
            useMarkPointTween(mesh)
          }
          provinceCircleGroup.add(mesh)
        }
      })

      resolve(provinceCircleGroup)
    })
  })
}
