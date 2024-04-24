// FXAA锯齿
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

export const useFxaaComposer = () => {
  const FXAA = new ShaderPass(FXAAShader)
  FXAA.uniforms['resolution'].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  )

  return {
    FXAA
  }
}
