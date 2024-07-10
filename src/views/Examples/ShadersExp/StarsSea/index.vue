<template>
  <div class="stars-sea">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <!-- canvas画布 -->
    <canvas id="webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入hooks
import { useWindowSize, useStatusByEnv, useTexture } from '@/hooks'
import { useThree } from './hook'
// 导入动画库
import * as TWEEN from '@tweenjs/tween.js'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
// 导入shader
import vertexShader from './shaders/Galaxy/vertex.glsl'
import fragmentShader from './shaders/Galaxy/fragment.glsl'
import starVertexShader from './shaders/Star/vertex.glsl'
import starFragmentShader from './shaders/Star/fragment.glsl'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)
// 定义参数
const params = {
  count: 10000, // 数量
  radius: 20, // 半径
  branch: 6, // 分支数（当前点在哪个分支上）
  color: '#ff6030', // 中心点颜色
  endColor: '#1b3984', // 边缘点颜色
  rotateScale: 0.3 // 旋转弯曲程度
}

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  status: Status, // 性能监视器
  controls: OrbitControls,
  texture: THREE.Texture,
  starMaterial: THREE.ShaderMaterial,
  material: THREE.ShaderMaterial

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    controls: mControls
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  controls = mControls
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
}

// 加载模型
const initModel = async () => {
  // 1.加载纹理
  texture = useTexture({
    path: './textures/particles/4.png'
  })
  // 2.创建星辰大海
  generateGalaxy()
  // 3.创建星星
  initStars()

  isLoading.value = false
}

const initStars = () => {
  // 1.创建缓冲几何体
  const geometry = new THREE.BufferGeometry()
  // 2.定义顶点的坐标数组
  const positions = new Float32Array((params.count / 5) * 3)
  // 3.点大小
  const scales = new Float32Array(params.count / 5)

  for (let i = 0; i < params.count / 5; i++) {
    // 当前顶点
    const current = i * 3

    // 点坐标
    positions[current] = (Math.random() - 0.5) * 400
    positions[current + 1] = (Math.random() - 0.5) * 400
    positions[current + 2] = (Math.random() - 0.5) * 400

    // 随机生成点的大小
    scales[current] = 1 + Math.random()
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

  starMaterial = new THREE.ShaderMaterial({
    vertexShader: starVertexShader,
    fragmentShader: starFragmentShader,
    transparent: true, // 透明
    vertexColors: true, // 使用顶点着色
    blending: THREE.AdditiveBlending, // 混合模式
    depthWrite: false, // 关闭深度检测
    uniforms: {
      uTime: {
        value: 0
      },
      uOpacity: {
        value: 0.0
      },
      uTexture: {
        value: texture
      }
    }
  })
  let point = new THREE.Points(geometry, starMaterial) as any
  point = createTween(point)
  // 执行动画
  point.fadeIn
    .start()
    .onUpdate((obj: any) => {
      starMaterial.uniforms.uOpacity.value = obj.opacity
    })
    .onComplete(() => {
      point.fadeOut
        .start()
        .onUpdate((obj: any) => {
          starMaterial.uniforms.uOpacity.value = obj.opacity
        })
        .onComplete(() => {
          point.fadeIn.start()
        })
    })
  // 添加到场景中
  scene.add(point)
}

// 创建渐变动画
const createTween = (point: any) => {
  const fadeInTween = new TWEEN.Tween({
    opacity: starMaterial.uniforms.uOpacity.value
  }).to(
    {
      opacity: 1.0
    },
    5000 + Math.random() * 1000
  )
  const fadeOutTween = new TWEEN.Tween({
    opacity: 1.0
  }).to(
    {
      opacity: 0.0
    },
    5000 + Math.random() * 1000
  )
  point.fadeIn = fadeInTween
  point.fadeOut = fadeOutTween

  return point
}

// 创建星辰大海
const generateGalaxy = () => {
  // 1.创建缓冲几何体
  const geometry = new THREE.BufferGeometry()
  // 2.定义顶点的坐标数组
  const positions = new Float32Array(params.count * 3)
  // 3.定义顶点颜色数组
  const colors = new Float32Array(params.count * 3)
  // 4.定义顶点大小数组
  const scales = new Float32Array(params.count)
  // 混合颜色
  const centerColor = new THREE.Color(params.color)
  const endColor = new THREE.Color(params.endColor)

  // 4.随机生成点
  for (let i = 0; i < params.count; i++) {
    // 判断当前点应该在哪一条分支对应的角度上
    const branchAngle = (i % params.branch) * ((Math.PI * 2) / params.branch)
    // 当前点距离圆心的距离(随机值）
    const distance = Math.random() * params.radius
    // 当前顶点
    const current = i * 3

    // 设置随机值，使得越靠近中心，点越密集效果
    const randomX =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
    const randomY =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
    const randomZ =
      (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5

    // Math.cos(branchAngle) * distance：点在当前分支上的x坐标
    // Math.sin(branchAngle) * distance：点在当前分支上的z坐标
    positions[current + 0] =
      Math.cos(branchAngle + distance * params.rotateScale) * distance + randomX
    positions[current + 1] = randomY
    positions[current + 2] =
      Math.sin(branchAngle + distance * params.rotateScale) * distance + randomZ

    // 颜色混合，形成渐变色
    const mixColor = centerColor
      .clone()
      .lerp(endColor, distance / params.radius)
    colors[current + 0] = mixColor.r
    colors[current + 1] = mixColor.g
    colors[current + 2] = mixColor.b

    // 随机生成点的大小
    scales[current] = Math.random()
  }

  // 设置缓冲区顶点数据
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

  // 设置点材质
  // const material = new THREE.PointsMaterial({
  //   vertexColors: true, // 使用顶点着色
  //   sizeAttenuation: true,
  //   depthWrite: false, // 深度写入
  //   blending: THREE.AdditiveBlending, // 颜色混合
  //   map: texture,
  //   alphaMap: texture,
  //   transparent: true
  // })
  material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true, // 透明
    vertexColors: true, // 使用顶点着色
    blending: THREE.AdditiveBlending, // 混合模式
    depthWrite: false, // 关闭深度检测
    uniforms: {
      uTime: {
        value: 0
      }
    }
  })
  const point = new THREE.Points(geometry, material)
  scene.add(point)
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  // 获取时间
  const elapsed = clock.getElapsedTime()
  material.uniforms.uTime.value = elapsed
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机控件
  controls && controls.update()
  // 更新动画时间
  TWEEN.update()
}

// 监听窗口的变化
const handleResize = (width: number, height: number) => {
  // 计算相机的aspect
  const aspect = width / height
  if (camera) {
    camera.aspect = aspect
    // 更新相机投影矩阵
    camera.updateProjectionMatrix()
  }
  // 重新设置输出画布大小
  if (renderer) {
    renderer.setSize(width, height)
  }
}

watch(
  () => [width, height],
  ([newWidth, newHeight]) => {
    handleResize(newWidth.value, newHeight.value)
  },
  { immediate: true, deep: true }
)

onMounted(() => {
  // 初始化
  init()
  // 加载模型
  initModel()
  // 播放动画
  animate()
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
