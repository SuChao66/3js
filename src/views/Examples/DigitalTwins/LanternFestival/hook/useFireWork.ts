import * as THREE from 'three'
// 导入光球点shader
import startPointVertex from '../shaders/startPoint/vertex.glsl'
import startPointFragment from '../shaders/startPoint/fragment.glsl'
// 导入爆炸烟花shader
import fireworkVertex from '../shaders/fireworks/vertex.glsl'
import fireworkFragment from '../shaders/fireworks/fragment.glsl'
// 导入hook
import { useAudio } from '@/hooks'

interface IPosition {
  x: number
  y: number
  z: number
}

/**
 * 创建烟花
 */
export const useFireWork = ({
  color,
  to,
  from = { x: 0, y: 0, z: 0 },
  scene
}: {
  color: THREE.Color
  to: IPosition
  from?: IPosition
  scene: THREE.Scene
}) => {
  // 1.创建烟花发射的光球点
  const startGeometry = new THREE.BufferGeometry()
  const startPosition = new Float32Array([from.x, from.y, from.z])
  startGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(startPosition, 3)
  )
  const aStepArray = new Float32Array([
    to.x - from.x,
    to.y - from.y,
    to.z - from.z
  ])
  startGeometry.setAttribute('aStep', new THREE.BufferAttribute(aStepArray, 3))
  // 创建着色器材质
  const startMaterial = new THREE.ShaderMaterial({
    vertexShader: startPointVertex,
    fragmentShader: startPointFragment,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: {
        value: 0
      },
      uSize: {
        value: 20
      },
      uColor: {
        value: color
      }
    }
  })
  // 创建烟花点球网格模型
  const startPoint = new THREE.Points(startGeometry, startMaterial)
  // 添加至场景中
  scene.add(startPoint)

  // 更新烟花光球的位置，播放烟花发射声音
  const clock = new THREE.Clock()

  // 2.创建烟花爆炸的效果
  const fireworkGeometry = new THREE.BufferGeometry()
  const fireworkCount = 150 + Math.floor(Math.random() * 150)
  // 爆炸烟花顶点位置数组
  const fireworkPositionArray = new Float32Array(fireworkCount * 3)
  // 爆炸烟花方向组
  const fireworkDirctionArray = new Float32Array(fireworkCount * 3)
  // 爆炸烟花大小数组
  const fireworkScaleArray = new Float32Array(fireworkCount)
  for (let i = 0; i < fireworkCount; i++) {
    // 设置烟花初始的位置
    fireworkPositionArray[i * 3 + 0] = to.x
    fireworkPositionArray[i * 3 + 1] = to.y
    fireworkPositionArray[i * 3 + 2] = to.z
    // 设置烟花初始大小
    fireworkScaleArray[i] = Math.random()
    // 设置烟花向四周发射的角度
    const theta = Math.random() * 2 * Math.PI
    const beta = Math.random() * 2 * Math.PI
    const r = Math.random()
    fireworkDirctionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta)
    fireworkDirctionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta)
    fireworkDirctionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta)
  }
  fireworkGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(fireworkPositionArray, 3)
  )
  fireworkGeometry.setAttribute(
    'aScale',
    new THREE.BufferAttribute(fireworkScaleArray, 1)
  )
  fireworkGeometry.setAttribute(
    'aRandom',
    new THREE.BufferAttribute(fireworkDirctionArray, 3)
  )
  const fireworkMaterial = new THREE.ShaderMaterial({
    vertexShader: fireworkVertex,
    fragmentShader: fireworkFragment,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: {
        value: 0
      },
      uSize: {
        value: 0 // 默认大小为0，不可见
      },
      uColor: {
        value: color
      }
    }
  })
  const firework = new THREE.Points(fireworkGeometry, fireworkMaterial)
  // 添加至场景中
  scene.add(firework)

  // 播放音频
  const fireSound = useAudio({
    path: `./voice/fireworkAudio/pow${Math.floor(Math.random() * 4) + 1}.ogg`,
    volume: 1
  })
  // 播放声音
  const sendSound = useAudio({
    path: './voice/fireworkAudio/send.mp3',
    volume: 1
  })

  // 更新烟花
  let fireSoundPlay = false
  let sendSoundPlay = false
  const update = () => {
    const elapsedTime = clock.getElapsedTime()
    if (elapsedTime >= 0 && elapsedTime < 1) {
      if (!sendSound.isPlaying && !sendSoundPlay) {
        sendSound.play()
        sendSoundPlay = true
      }
      // 1.显示发射光球
      startMaterial.uniforms.uTime.value = elapsedTime
      startMaterial.uniforms.uSize.value = 20.0
    } else if (elapsedTime > 1 && elapsedTime < 5) {
      // 2.隐藏光球，显示烟花
      const time = elapsedTime - 1
      // 让光球元素消失
      startMaterial.uniforms.uSize.value = 0
      startPoint.clear()
      startGeometry.dispose()
      startMaterial.dispose()
      // 播放烟花爆炸声音
      if (!fireSound.isPlaying && !fireSoundPlay) {
        fireSound.play()
        fireSoundPlay = true
      }
      // 显示爆炸烟花
      fireworkMaterial.uniforms.uSize.value = 20
      fireworkMaterial.uniforms.uTime.value = time
    } else {
      // 3.销毁烟花
      fireworkMaterial.uniforms.uSize.value = 0
      firework.clear()
      fireworkGeometry.dispose()
      fireworkMaterial.dispose()
      scene.remove(firework)
      scene.remove(startPoint)
      return 'complete'
    }
  }

  return {
    startPoint,
    firework,
    update
  }
}
