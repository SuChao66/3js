<template>
  <div class="exhibition-hall">
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
// 导入gltfloader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入dracoloader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// 导入hooks
import {
  useWindowSize,
  useStatusByEnv,
  useCanvasSprite,
  usePointer,
  useRayCaster,
  useCameraTween,
  useTexture,
  useProgress
} from '@/hooks'
import { useThree } from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
// 导入动画库
import gsap from 'gsap'
import * as TWEEN from '@tweenjs/tween.js'

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
// 精灵数组
const sprites: THREE.Sprite[] = []
// sprite文本对象
const spritesText = [
  {
    text: '球形机器人',
    position: new THREE.Vector3(0, 1, 0)
  }
]

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  status: Status, // 性能监视器
  controls: OrbitControls,
  exhibitionHall: any, // 展厅模型
  model: THREE.Group // 网格模型

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
  model = new THREE.Group()
  scene.add(model)

  // 加载展厅模型
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/gltf/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load('./models/exhibition.glb', (gltf) => {
    exhibitionHall = gltf.scene
    model.add(exhibitionHall)
    // 对场景模型进行处理
    handleExhibitionHall()
    // 向场景中添加精灵图案
    handleAddSpriteText()
  })
}

// 对场景模型进行处理
const handleExhibitionHall = () => {
  exhibitionHall.traverse((child: any) => {
    // 1.对场景中的光源进行处理
    if (child.isLight) {
      child.intensity = 1
    }
    // 2.对场景的地面进行材质处理
    if (child.isMesh && child.material.name.indexOf('Floor') !== -1) {
      child.material = new THREE.MeshBasicMaterial({
        map: child.material.map
      })
    }
    // 3.对场景中的玻璃进行材质处理
    if (child.isMesh && child.material.name.indexOf('Glass') !== -1) {
      // 计算顶点法向量
      child.geometry.computeVertexNormals()
      // 创建高光网格材质
      child.material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        envMap: scene.environment,
        refractionRatio: 0.98, // 空气的折射率（IOR）（约为1）除以材质的折射率
        reflectivity: 0.98, // 环境贴图对表面的影响程度
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      })
    }
  })
}

// 向场景中添加精灵文案
const handleAddSpriteText = () => {
  spritesText.forEach((item) => {
    const sprite = useCanvasSprite({
      text: item.text,
      position: item.position
    })
    sprite.add(createCircleTexture())
    // 添加到精灵数组中
    sprites.push(sprite)
    // 添加到场景中
    scene.add(sprite)
  })
}

// 创建纹理
const createCircleTexture = () => {
  // 加载纹理
  const texture = useTexture({
    path: './texture/neural.png'
  })
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    alphaMap: texture,
    side: THREE.DoubleSide
  })
  const geometry = new THREE.CircleGeometry(2, 32)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.rotation.x = -Math.PI / 2
  mesh.position.y -= 4
  gsap.to(mesh.rotation, {
    z: Math.PI * 2,
    duration: 2,
    repeat: -1
  })

  return mesh
}

// 鼠标点击事件
const handleMouseClick = (event: any) => {
  const { x, y } = usePointer(event)
  const chooseSprite = useRayCaster({
    x,
    y,
    camera,
    chooseObjArr: sprites
  })
  if (chooseSprite) {
    // 鼠标点击位置，点击后，让相机target指向此位置
    const point = chooseSprite.point
    // 鼠标点击后，相机的位置
    const endCameraPos = new THREE.Vector3(point.x + 2, point.y, point.z + 2)
    useCameraTween(camera.position, controls.target, endCameraPos, point)
      .onUpdate((obj) => {
        // 更新相机的位置坐标
        camera.position.set(obj.x, obj.y, obj.z)
        // 动态计算相机视线
        controls.target.set(obj.tx, obj.ty, obj.tz)
        // 更新相机控件
        controls.update()
      })
      .start()
  }
}

// 渲染
const animate = () => {
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

onMounted(async () => {
  // 初始化
  init()
  // 加载模型
  initModel()
  // 播放动画
  animate()
  // 注册点击事件
  renderer.domElement.addEventListener('click', handleMouseClick)
  // 加载进度
  useProgress((progress: number) => {
    currentProgress.value = progress
    if (progress === 100) {
      isLoading.value = false
    }
  })
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
  // 取消点击事件
  renderer.domElement.removeEventListener('click', handleMouseClick)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
