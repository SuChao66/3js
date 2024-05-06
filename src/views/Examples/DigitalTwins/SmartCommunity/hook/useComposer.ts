// ShaderPass功能：使用后处理Shader创建后处理通道
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import * as THREE from 'three'
import { useEffectComposer, useUnrealBloomPass, useFxaaComposer } from '@/hooks'

export const useComposer = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const { composer: bloomComposer } = useEffectComposer(renderer, scene, camera)
  bloomComposer.renderToScreen = false //需要设置：离屏渲染
  const { unrealBloomPass } = useUnrealBloomPass()
  const { FXAA } = useFxaaComposer()
  bloomComposer.addPass(FXAA)
  bloomComposer.addPass(unrealBloomPass)

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `

  const fragmentShader = `
    uniform sampler2D baseTexture;
    uniform sampler2D bloomTexture;
    varying vec2 vUv;
    void main() {
      gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
    }
  `

  const renderTargetPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: {
          value: null
        },
        bloomTexture: {
          // 获取bloomComposer的渲染结果：从帧缓冲区中读取
          value: bloomComposer.renderTarget2.texture
        }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      defines: {}
    }),
    'baseTexture'
  )

  return {
    bloomComposer,
    renderTargetPass
  }
}
