import * as THREE from 'three'
// 导入hook
import { useMarkPoint, useMarkPointTween } from './'

/**
 * 标注热点新闻
 * @param path
 */
export const useHotNews = (path: string) => {
  // 1.创建文件加载器
  const loader = new THREE.FileLoader()
  // 设置loader请求的响应类型
  loader.setResponseType('json')
  // 标注点组对象
  const spriteGroup = new THREE.Group()
  // 2.加载数据
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      for (let i = 0; i < data.length; i++) {
        const lon = data[i].E // 经度
        const lat = data[i].N // 纬度
        // 生成mesh
        const duration = (Math.random() * 2 + 1) * 1000
        const mesh = useMarkPoint({
          path: './images/planets/circle.png',
          lon,
          lat,
          color: 0x22ffcc,
          duration,
          minScale: Math.random() * 0.05,
          maxScale: Math.random() * 0.15
        })
        useMarkPointTween(mesh)
        spriteGroup.add(mesh)
      }
    })
    resolve(spriteGroup)
  })
}
