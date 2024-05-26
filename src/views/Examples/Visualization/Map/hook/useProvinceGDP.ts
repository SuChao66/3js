import * as THREE from 'three'
// 导入常量
import { gdpMax } from '../constants'

interface IProvinceGdp {
  gdp: number
  color: THREE.Color
  name: string
}

interface IProvinceGdpColor {
  [key: string]: IProvinceGdp
}

export const useProvinceGDP = ({ path }: { path: string }) => {
  // 定义两个颜色，进行颜色插值，GDP最高对应红色，GDP对应白色
  const color1 = new THREE.Color(0xffffff)
  const color2 = new THREE.Color(0xff0000)
  // 加载数据
  const loader = new THREE.FileLoader()
  loader.setResponseType('json')
  return new Promise((resolve) => {
    // 每个国家的名字作为属性，属性值是国家对应GDP和可视化颜色值
    const provinceGdpColor: IProvinceGdpColor = {}
    loader.load(path, (data: any) => {
      data.arr.forEach((obj: any) => {
        const countryName = obj.name
        const gdp = Number(obj.value)
        let color = null
        if (gdp) {
          // 颜色插值
          color = color1.clone().lerp(color2.clone(), Math.sqrt(gdp / gdpMax))
        } else {
          color = color1.clone()
        }
        // 保存到对象中
        provinceGdpColor[countryName] = {
          gdp: gdp,
          color: color,
          name: countryName
        }
      })
      resolve(provinceGdpColor)
    })
  })
}
