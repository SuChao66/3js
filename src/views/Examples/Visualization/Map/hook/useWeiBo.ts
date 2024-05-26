import * as THREE from 'three'
// 导入hook
import { useLon2Mercator, usePoints } from '@/hooks'

export const useWeiBo = ({
  path,
  mapSize
}: {
  path: string
  mapSize: number
}) => {
  // 加载数据
  const loader = new THREE.FileLoader()
  loader.setResponseType('json')
  return new Promise((resolve) => {
    const pointGroup = new THREE.Group()
    loader.load(path, (data: any) => {
      const coord = data.coordinates
      const pointsArr = []
      for (let i = 0; i < coord.length; i += 2) {
        const { x, y } = useLon2Mercator(coord[i], coord[i + 1])
        pointsArr.push(x, y, 0)
      }
      const point = usePoints({
        pointsArr: pointsArr,
        size: 1.5
      })
      pointGroup.add(point)
      pointGroup.position.z += mapSize! * 0.02 // 适当偏移解决深度冲突
    })

    resolve(pointGroup)
  })
}
