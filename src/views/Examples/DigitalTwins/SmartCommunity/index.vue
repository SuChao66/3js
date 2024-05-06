<template>
  <div class="mobile">
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 楼栋标签 -->
    <STag v-for="(tag, index) in buildingsTags" :key="index" :name="tag" />
    <!-- 楼栋 -->
    <div ref="buildingsTagRef"></div>
    <!-- 控制器 -->
    <SControl
      v-if="!isLoading"
      :isDamping="isDamping"
      :isDark="isDark"
      @handleDamping="handleDamping"
      @handleDark="handleDark"
    />
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
// 导入GLTF加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入draco解压器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 导入CSS2DRenderer
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
// 导入相机控件
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import * as TWEEN from '@tweenjs/tween.js'
// 后处理
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// 导入hooks
import { useWindowSize, useStatusByEnv, useCameraTween } from '@/hooks'
import {
  useThree,
  useCommunityMaterial,
  useBuildingsTag,
  useComposer
} from './hook'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import STag from './components/STag/index.vue'
import SControl from './components/SControl/index.vue'
// 导入常量
import { cameraPos, cameraTarget, personPos, personHeight } from './constants'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 楼栋渲染器
const buildingsTagRef = ref<HTMLDivElement | null>(null)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 模型加载进度
const currentProgress = ref<number>(0)
// 请求动画帧
const timer = ref<number>(0)
// 水池纹理
let waterMap: THREE.Texture | null = null
// 楼栋标签数组
const buildingsTags = ref<string[]>([])
// 是否开启漫游
const isDamping = ref<boolean>(false)
// 是否是夜晚
const isDark = ref<boolean>(false)
const materials: any = {}

// 1.定义变量
let scene: THREE.Scene, // 场景
  camera: THREE.PerspectiveCamera, // 相机
  renderer: THREE.WebGLRenderer, // 渲染器
  css2DRenderer: CSS2DRenderer, // css2渲染器
  model: THREE.Group, // 模型集合
  status: Status, // 性能监视器
  controls: OrbitControls,
  person: any, // 人物模型
  mixer: THREE.AnimationMixer, // 人物动画
  composer: EffectComposer, // 后处理
  bloomComposer: EffectComposer,
  renderTargetPass: any,
  bloomLayer: THREE.Layers

// 初始化
const init = () => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    status: mStatus,
    controls: mControls,
    css2DRenderer: mCss2DRenderer,
    composer: mComposer
  } = useThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  renderer = mRenderer
  controls = mControls
  css2DRenderer = mCss2DRenderer
  composer = mComposer
  // 添加性能监视器
  if (useStatusByEnv()) {
    statusRef.value?.appendChild(mStatus.dom)
  }
  // 添加css2DRenderer
  buildingsTagRef.value?.appendChild(css2DRenderer.domElement)
}

// 加载模型
const initModel = () => {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('./draco/')
  const loader = new GLTFLoader()
  loader.setDRACOLoader(dracoLoader)
  loader.load(
    './models/小区2.glb',
    (gltf) => {
      model = new THREE.Group()
      model.add(gltf.scene)
      // 1.将模型添加至场景中
      scene.add(model)
      // 2.对模型进行处理，接受光照阴影
      const { map } = useCommunityMaterial(gltf.scene)
      waterMap = map
      // 3.创建楼栋标签
      useBuildingsTag(buildingsTags.value, gltf.scene)
      // 4.加载虚拟人物
      initPerson(loader)
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        isLoading.value = false
      }
    }
  )
}

// 加载人物
const initPerson = (loader: any) => {
  loader.load('./models/xRobot.glb', (gltf: any) => {
    console.log(gltf)
    // 1.初始化人物模型
    person = new THREE.Group()
    person.position.copy(personPos)
    person.add(gltf.scene)
    // 2.将人物添加至模型中
    model.add(person)
    // 3.接受阴影
    gltf.scene.traverse((obj: any) => {
      if (obj.type === 'SkinnedMesh') {
        // 设置产生投影的网格模型
        obj.castShadow = true
        // 设置接收阴影的投影面
        obj.receiveShadow = true
      }
    })
    // 4.动画播放
    mixer = new THREE.AnimationMixer(gltf.scene)
    const idleAction = mixer.clipAction(gltf.animations[2])
    const walkAction = mixer.clipAction(gltf.animations[6])
    idleAction.play()
    walkAction.play()
    idleAction.weight = 1.0
    walkAction.weight = 0.0
    //  切换为休闲状态idle
    person.idle = function () {
      idleAction.enabled = true
      idleAction.setEffectiveTimeScale(1)
      idleAction.setEffectiveWeight(1)
      walkAction.crossFadeTo(idleAction, 1, true)
    }
    // 切换为步行状态walk
    person.walk = function () {
      walkAction.enabled = true
      walkAction.setEffectiveTimeScale(1)
      walkAction.setEffectiveWeight(1)
      idleAction.crossFadeTo(walkAction, 0.5, true)
    }
  })
}

// 初始化楼栋标签数据
const initBuildingTags = () => {
  const tags = []
  tags.push('物业', '西大门', '东大门')
  for (let i = 1; i < 30; i++) {
    let name = '' + i
    if (i < 10) name = '0' + name
    tags.push(name)
  }
  buildingsTags.value = tags
}

// 宇宙漫游
const handleDamping = () => {
  isDamping.value = !isDamping.value
  if (isDamping.value) {
    const endCameraPos = new THREE.Vector3(
      personPos.x,
      personHeight,
      personPos.z + 5
    )
    createCameraTween(endCameraPos, personPos)
  } else {
    createCameraTween(cameraPos, cameraTarget)
  }
}

const createCameraTween = (endPos: THREE.Vector3, endTarget: THREE.Vector3) => {
  useCameraTween(camera.position, controls.target, endPos, endTarget)
    .onUpdate((obj) => {
      // 更新相机的位置坐标
      camera.position.set(obj.x, obj.y, obj.z)
      // 动态计算相机视线
      controls.target.set(obj.tx, obj.ty, obj.tz)
      controls.update()
    })
    .start()
}

// 白天/黑夜
const handleDark = () => {
  isDark.value = !isDark.value
  const { bloomComposer: mBloomComposer, renderTargetPass: mRenderTargetPass } =
    useComposer(renderer, scene, camera)
  bloomComposer = mBloomComposer
  renderTargetPass = mRenderTargetPass

  if (isDark.value) {
    composer.addPass(renderTargetPass)
  } else {
    composer.removePass(renderTargetPass)
  }
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  const delta = clock.getDelta()
  // 渲染器渲染
  renderer && renderer.render(scene, camera)
  // css2D渲染器
  css2DRenderer && css2DRenderer.render(scene, camera)
  // 更新性能监视器
  status && status.update()
  // 更新水池纹理的偏移量
  if (waterMap) {
    waterMap.offset.x += 0.002
  }
  // 更新动画时间
  mixer && mixer.update(delta)
  // 更新TWEEN
  TWEEN.update()
  // 后处理渲染
  composer && composer.render()
  if (isDark.value) {
    scene.traverse((obj: any) => {
      if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
        // 保存obj对应的材质
        materials[obj.uuid] = obj.material
        // 图层不是1的mesh设置黑色材质
        const darkMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000
        })
        obj.material = darkMaterial
      }
    })
    bloomComposer && bloomComposer.render()
    scene.traverse((obj: any) => {
      if (materials[obj.uuid]) {
        // 设置为黑色材质的mesh恢复为原来自身的颜色
        obj.material = materials[obj.uuid]
        delete materials[obj.uuid]
      }
    })
  }
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
}

const initBoomLayer = () => {
  bloomLayer = new THREE.Layers()
  bloomLayer.set(1)
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
  // 重新设置css2DLabel输出画布大小
  if (css2DRenderer) {
    css2DRenderer.setSize(width, height)
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
  // 初始化楼栋标签数据
  initBuildingTags()
  initBoomLayer()
})

onUnmounted(() => {
  renderer.domElement.remove()
  renderer.clear()
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
})
</script>

<style lang="less" scoped></style>
