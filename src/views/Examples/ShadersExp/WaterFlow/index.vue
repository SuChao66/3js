<template>
  <div class="water-flow">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- GUI控制器 -->
    <div ref="guiRef"></div>
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
import { useWindowSize, useStatusByEnv, useGUI } from '@/hooks'
import { useThree } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
// 导入shader
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// GUI
const guiRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)
// 着色器变量
const params = {
  uWaresFrequency: 14, // 主波浪频率
  uScale: 0.03, // 主波浪幅度
  uNoiseFrequency: 10, // 噪音频率
  uNoiseScale: 1.5, // 噪声幅度
  uXzFrequency: 1.5, // xoz平面上，x、z频率比值，确保x、z方向上波纹频率不一致
  uLowColor: '#ffff00', // 最低点颜色
  uHighColor: '#00ffff', // 最高点颜色
  uOpacity: 1.0, // 透明度
  uXspeed: 1.0, // x方向波纹移动速度
  uZspeed: 1.5, // z方向波纹移动速度
  uNoiseSpeed: 2.0 // 噪音移动速度
}
const uniforms = {
  // 时间
  uTime: {
    value: 0.0
  },
  // 主波浪频率
  uWaresFrequency: {
    value: params.uWaresFrequency
  },
  // 主波浪幅度
  uScale: {
    value: params.uScale
  },
  // 噪声频率
  uNoiseFrequency: {
    value: params.uNoiseFrequency
  },
  // 噪声幅度
  uNoiseScale: {
    value: params.uNoiseScale
  },
  // x、z平面波纹频率比值
  uXzFrequency: {
    value: params.uXzFrequency
  },
  // 最低点颜色
  uLowColor: {
    value: new THREE.Color(params.uLowColor)
  },
  // 最高点颜色
  uHighColor: {
    value: new THREE.Color(params.uHighColor)
  },
  // 透明度
  uOpacity: {
    value: params.uOpacity
  },
  // x方向移动速度
  uXspeed: {
    value: params.uXspeed
  },
  // z方向移动速度
  uZspeed: {
    value: params.uZspeed
  },
  // 噪音移动速度
  uNoiseSpeed: {
    value: params.uNoiseSpeed
  }
}

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  status: Status, // 性能监视器
  controls: OrbitControls,
  shaderMaterial: THREE.ShaderMaterial

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
    // statusRef.value?.appendChild(mStatus.dom)
  }
}

// 初始化GUI
const initGUI = () => {
  const gui = useGUI()
  guiRef.value?.appendChild(gui.domElement)
  // 主波浪频率
  gui
    .add(params, 'uWaresFrequency')
    .min(1)
    .max(100)
    .step(1)
    .name('主波浪频率')
    .onChange((value: number) => {
      shaderMaterial.uniforms.uWaresFrequency.value = value
    })
  // 主波浪幅度
  gui
    .add(params, 'uScale')
    .min(0)
    .max(0.5)
    .step(0.001)
    .name('主波浪幅度')
    .onChange((value: number) => {
      shaderMaterial.uniforms.uScale.value = value
    })
  // 噪声频率
  gui
    .add(params, 'uNoiseFrequency')
    .min(1)
    .max(100)
    .step(0.1)
    .name('噪声频率')
    .onChange((value: number) => {
      shaderMaterial.uniforms.uNoiseFrequency.value = value
    })
  // 噪声幅度
  gui
    .add(params, 'uNoiseScale')
    .min(0)
    .max(5)
    .step(0.001)
    .name('噪声幅度')
    .onChange((value: number) => {
      shaderMaterial.uniforms.uNoiseScale.value = value
    })
  // x、z平面波纹频率比值
  gui
    .add(params, 'uXzFrequency')
    .min(1)
    .max(5)
    .step(0.1)
    .name('xoz平面频率比值')
    .onChange((value: number) => {
      shaderMaterial.uniforms.uXzFrequency.value = value
    })
  // 最低点颜色
  gui
    .addColor(params, 'uLowColor')
    .name('最低点颜色')
    .onChange((value: number) => {
      shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value)
    })
  // 最高点颜色
  gui
    .addColor(params, 'uHighColor')
    .name('最高点颜色')
    .onChange((value: number) => {
      shaderMaterial.uniforms.uHighColor.value = new THREE.Color(value)
    })
  // 透明度
  gui
    .add(params, 'uOpacity')
    .name('透明度')
    .min(0)
    .max(1)
    .step(0.1)
    .onChange((value: number) => {
      shaderMaterial.uniforms.uOpacity.value = value
    })
  // x方向移动速度
  gui
    .add(params, 'uXspeed')
    .name('x方向移动速度')
    .min(1)
    .max(10)
    .step(0.5)
    .onChange((value: number) => {
      shaderMaterial.uniforms.uXspeed.value = value
    })
  // z方向移动速度
  gui
    .add(params, 'uZspeed')
    .name('z方向移动速度')
    .min(1)
    .max(10)
    .step(0.5)
    .onChange((value: number) => {
      shaderMaterial.uniforms.uZspeed.value = value
    })
  // 噪音移动速度
  gui
    .add(params, 'uNoiseSpeed')
    .name('噪音移动速度')
    .min(0)
    .max(5)
    .step(0.001)
    .onChange((value: number) => {
      shaderMaterial.uniforms.uNoiseSpeed.value = value
    })
}

// 加载模型
const initModel = async () => {
  const planeGeometry = new THREE.PlaneGeometry(1, 1, 1024, 1024)
  shaderMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })
  const plane = new THREE.Mesh(planeGeometry, shaderMaterial)
  plane.rotateX(-Math.PI / 2)
  scene.add(plane)

  isLoading.value = false
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  // 获取时间
  const elapsed = clock.getElapsedTime()
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机控件
  controls && controls.update()
  // 修改着色器时间
  shaderMaterial.uniforms.uTime.value = elapsed
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
  // 初始化GUI
  initGUI()
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
