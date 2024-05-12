import * as THREE from 'three'
// 导入常量
import { gdpMax } from '../constants'

interface ICountryGdp {
  gdp: number
  color: THREE.Color
}

interface ICountryGdpColor {
  [key: string]: ICountryGdp
}

export const useCountryGDP = (path: string) => {
  // 定义两个颜色，进行颜色插值，GDP最高对应红色，GDP对应白色
  const color1 = new THREE.Color(0xffffff)
  const color2 = new THREE.Color(0xff0000)
  // 加载数据
  const loader = new THREE.FileLoader()
  loader.setResponseType('json')
  return new Promise((resolve) => {
    // 每个国家的名字作为属性，属性值是国家对应GDP和可视化颜色值
    const countryGdpColor: ICountryGdpColor = {}
    loader.load(path, (data: any) => {
      data.Root.data.record.forEach((obj: any) => {
        // 获取所有国家2015年GDP数据
        if (obj.field[2].text === '2015') {
          const countryName = obj.field[0].text
          const gdp = Number(obj.field[3].text)
          let color = null
          if (gdp) {
            // 颜色插值
            color = color1.clone().lerp(color2.clone(), Math.sqrt(gdp / gdpMax))
          } else {
            color = color1.clone()
          }
          // 保存到对象中
          countryGdpColor[countryName] = {
            gdp: gdp,
            color: color
          }
        }
      })
      resolve(countryGdpColor)
    })
  })
}
