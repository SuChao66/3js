import * as THREE from 'three'
// 导入hook
import { useMarkPoint, useLightPillar } from './'

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
  // 光柱底座组对象，用于射线拾取
  const chooseGroup = new THREE.Group()
  // 2.加载数据
  return new Promise((resolve) => {
    loader.load(path, (data: any) => {
      for (let i = 0; i < data.length; i++) {
        const lon = data[i].E // 经度
        const lat = data[i].N // 纬度
        const hot = data[i].hot // 热度
        // const name = data[i].name // mesh对应新闻name属性 表示新闻发生地点
        // const title = data[i].title // 新闻标题
        const href = data[i].herf //新闻超链接地址
        let color
        if (hot > 0.25) {
          color = 0xff4444 // 高热度
        } else if (hot > 0.15 && hot < 0.25) {
          color = 0xffff66 // 中热点
        } else {
          color = 0x22ffcc // 低热度
        }
        // 创建光柱底座
        const mesh = useMarkPoint({
          path: './images/planets/标注.png',
          lon,
          lat,
          isAnimation: false,
          minScale: 0.06,
          color
        })
        mesh.href = href
        chooseGroup.add(mesh)
        spriteGroup.add(chooseGroup)
        // 创建波动光圈
        const duration = (Math.random() * 1 + 1) * 1000
        const WaveMesh = useMarkPoint({
          path: './images/planets/circle.png',
          lon,
          lat,
          duration,
          color
        })
        spriteGroup.add(WaveMesh)
        // 创建光柱
        const lightPillarGroup = useLightPillar({
          path: './images/planets/light_column.png',
          lon,
          lat,
          h: hot,
          color
        })
        spriteGroup.add(lightPillarGroup)
      }
    })
    resolve({ spriteGroup, chooseGroup })
  })
}
