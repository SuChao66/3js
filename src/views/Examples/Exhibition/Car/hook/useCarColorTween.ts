import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
// 导入常量
import { carColors } from '../constants'

export const useCarColorTween = (model: THREE.Group) => {
  // 1.定义颜色修改函数
  const setColor = (r: number, g: number, b: number) => {
    model.traverse((object: any) => {
      if (object.type === 'Mesh') {
        if (object.name.slice(0, 2) == '外壳') {
          //外壳颜色设置
          object.material.color.setRGB(r, g, b)
        }
      }
    })
  }
  // 2.将color转为10进制
  const colorArr = []
  for (let i = 0; i < carColors.length; i++) {
    const color = new THREE.Color(carColors[i])
    colorArr.push({
      r: color.r,
      g: color.g,
      b: color.b
    })
  }
  // console.log(colorArr)
  // 3.定义第一个颜色，默认车辆的颜色
  const startColor = {
    r: colorArr[0].r,
    g: colorArr[0].g,
    b: colorArr[0].b
  }
  // 定义所有颜色动画片段数组
  const colorTweenArr = []
  // 4.批量创建颜色动画片段
  for (let i = 0; i < colorArr.length; i++) {
    const startTween = new TWEEN.Tween(startColor)
      .to(
        {
          r: colorArr[i].r,
          g: colorArr[i].g,
          b: colorArr[i].b
        },
        1000
      )
      .onUpdate(() => {
        setColor(startColor.r, startColor.g, startColor.b)
      })
    const nextTween = new TWEEN.Tween(startColor)
    if (i < colorArr.length - 1) {
      // 不是最后一个颜色
      nextTween
        .to(
          {
            r: colorArr[i + 1].r,
            g: colorArr[i + 1].g,
            b: colorArr[i + 1].b
          },
          1000
        )
        .onUpdate(() => {
          setColor(startColor.r, startColor.g, startColor.b)
        })
    } else {
      // 是最后一个颜色
      nextTween
        .to(
          {
            r: colorArr[0].r,
            g: colorArr[0].g,
            b: colorArr[0].b
          },
          1000
        )
        .onUpdate(() => {
          setColor(startColor.r, startColor.g, startColor.b)
        })
    }
    colorTweenArr.push(startTween, nextTween)
  }
  // console.log(colorTweenArr)
  // 批量连接所有动画片段
  for (let i = 0; i < colorTweenArr.length - 1; i++) {
    colorTweenArr[i].chain(colorTweenArr[i + 1])
  }
  colorTweenArr[colorTweenArr.length - 1].chain(colorTweenArr[0]) //首尾相接循环执行
  // colorTweenArr[0].start() //播放一串动画片段

  const colorTween = colorTweenArr[0]

  return colorTween
}
