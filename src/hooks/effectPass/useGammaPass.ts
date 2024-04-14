// 伽马校正后处理Shader
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

export const useGammaPass = () => {
  const gammaPass = new ShaderPass(GammaCorrectionShader)

  return {
    gammaPass
  }
}
