import * as THREE from 'three'
import output_fragment from '../shaders/output_fragment.glsl.js'
import output_fragment_circle from '../shaders/output_fragment_circle.glsl.js'

/**
 * 修改楼房的shader，增加渐变色的效果
 * @param build
 * @param isCircle 是否是光环效果
 */
export const useBuildMaterial = ({
  build,
  isCircle = true
}: {
  build: any
  isCircle?: boolean
}) => {
  let materialShader: any = null

  build.material.onBeforeCompile = (shader: any) => {
    materialShader = shader
    shader.uniforms.time = {
      value: 0.0
    }

    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      [
        'varying vec3 vPosition;',
        'void main() {',
        'vPosition = position;'
      ].join('\n')
    )
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      ['varying vec3 vPosition;', 'uniform float time;', 'void main() {'].join(
        '\n'
      )
    )

    if (isCircle) {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        output_fragment_circle
      )
    } else {
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        output_fragment
      )
    }

    // 创建一个时钟对象Clock
    const clock = new THREE.Clock()
    function scanAnimation() {
      // 获得两次scanAnimation执行的时间间隔deltaTime
      var deltaTime = clock.getDelta()
      if (materialShader) {
        materialShader.uniforms.time.value += deltaTime
        if (materialShader.uniforms.time.value > 6)
          materialShader.uniforms.time.value = 0
      }

      requestAnimationFrame(scanAnimation)
    }
    scanAnimation()
  }
}
