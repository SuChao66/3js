import * as THREE from 'three'
import gsap from 'gsap'
// 导入着色器
import outputFragmentGirdColor from '../shaders/output_fragment_gird_color.glsl.js'
import outputFragmentSpreadCircle from '../shaders/output_fragment_spread_circle.glsl.js'
import outputFragmentLightLine from '../shaders/output_fragment_light_line.glsl.js'
import outputFragmentTopLine from '../shaders/output_fragment_top_line.glsl.js'

/**
 * 修改city的材质
 * @param mesh
 */
export const useCityMaterial = (mesh: any) => {
  mesh.material.onBeforeCompile = (shader: any) => {
    // console.log(shader)
    // console.log(shader.fragmentShader)
    // console.log(shader.vertexShader)
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      ['#include <dithering_fragment>', '//#end#'].join('\n')
    )
    // 1.修改建筑物颜色（颜色渐变）
    useGirdColor(shader, mesh)
    // 2.增加光波扩散效果
    useSpreadLightCircle(shader)
    // 3.增加光带扫描效果
    useLightLine(shader)
    // 4.增加建筑物扫描效果
    useToTopLine(shader)
  }
}

/**
 * 修改建筑物颜色
 * @param shader 着色器
 * @param mesh 模型
 */
const useGirdColor = (shader: any, mesh: any) => {
  // 1.计算边界矩形
  mesh.geometry.computeBoundingBox()
  const { min, max } = mesh.geometry.boundingBox
  // 2.获取物体的高度差
  const uHeight = max.y - min.y
  // 3.添加着色器变量
  shader.uniforms.uTopColor = {
    value: new THREE.Color('#7B68ff')
  }
  shader.uniforms.uHeight = {
    value: uHeight
  }
  // 4.修改顶点着色器
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    ['#include <common>', 'varying vec3 vPosition;'].join('\n')
  )
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    ['#include <begin_vertex>', 'vPosition = position;'].join('\n')
  )
  // 5.修改片元着色器
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    [
      '#include <common>',
      'uniform vec3 uTopColor;',
      'uniform float uHeight;',
      'varying vec3 vPosition;'
    ].join('\n')
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    outputFragmentGirdColor
  )
}

/**
 * 增加光波扩散的效果
 * @param shader 着色器
 * @param center 光波圆心
 */
const useSpreadLightCircle = (
  shader: any,
  center = new THREE.Vector2(0, 0)
) => {
  // 1.设置光波扩散的中心点
  shader.uniforms.uSpreadCenter = {
    value: center
  }
  // 2.设置光波条带的宽度
  shader.uniforms.uSpreadWidth = {
    value: 30.0
  }
  // 3.设置光波渲染的时间
  shader.uniforms.uSpreadTime = {
    value: 0.0
  }
  // 4.修改片元着色器
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    [
      '#include <common>',
      'uniform vec2 uSpreadCenter;',
      'uniform float uSpreadWidth;',
      'uniform float uSpreadTime;'
    ].join('\n')
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    outputFragmentSpreadCircle
  )

  gsap.to(shader.uniforms.uSpreadTime, {
    value: 50.0,
    duration: 2,
    ease: 'none',
    repeat: -1
  })
}

/**
 * 增加光带扫描效果
 * @param shader
 */
const useLightLine = (shader: any) => {
  // 1.设置光波条带的宽度
  shader.uniforms.uLightLineWidth = {
    value: 50.0
  }
  // 2.设置光波渲染的时间
  shader.uniforms.uLightLineTime = {
    value: -1500
  }
  // 3.修改片元着色器
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    [
      '#include <common>',
      'uniform float uLightLineWidth;',
      'uniform float uLightLineTime;'
    ].join('\n')
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    outputFragmentLightLine
  )
  gsap.to(shader.uniforms.uLightLineTime, {
    value: 1500,
    duration: 5,
    ease: 'none',
    repeat: -1
  })
}

/**
 * 增加建筑物扫描效果
 * @param shader
 */
const useToTopLine = (shader: any) => {
  // 1.扩散的时间
  shader.uniforms.uToTopTime = { value: 0 }
  // 2.设置条带的宽度
  shader.uniforms.uToTopWidth = { value: 40 }
  // 3.修改片元着色器
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    [
      '#include <common>',
      'uniform float uToTopTime;',
      'uniform float uToTopWidth;'
    ].join('\n')
  )
  shader.fragmentShader = shader.fragmentShader.replace(
    '//#end#',
    outputFragmentTopLine
  )
  gsap.to(shader.uniforms.uToTopTime, {
    value: 500,
    duration: 3,
    ease: 'none',
    repeat: -1
  })
}
