<template>
  <div class="smart-factory">
    <div class="btn-operation" v-if="!isLoading">
      <el-button size="large" plain round @click="handlePlay">
        {{ isPlaying ? '暂停' : '播放' }}
      </el-button>
      <el-button size="large" plain round @click="handleEnvironment('rain')">
        下雨
      </el-button>
      <el-button size="large" plain round @click="handleEnvironment('snow')">
        下雪
      </el-button>
    </div>
    <!-- 标签 -->
    <div id="tag" style="display: none">
      <STag
        v-bind="cunchuInfo[currentSelectModel]"
        @handleClose="handleClose"
      />
    </div>
    <!-- 标签渲染 -->
    <div ref="tagRef"></div>
    <!-- 性能监视器 -->
    <div ref="statusRef"></div>
    <!-- 加载动画 -->
    <transition name="fade">
      <SLoading v-if="isLoading" :currentProgress="currentProgress" />
    </transition>
    <canvas id="webgl"></canvas>
  </div>
</template>

<script setup lang="ts">
// 导入THREE
import * as THREE from 'three'
// 导入性能监视器
import Status from 'three/examples/jsm/libs/stats.module'
// 导入相机控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入GLTF加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 导入CSS2D
import {
  CSS2DObject,
  CSS2DRenderer
} from 'three/examples/jsm/renderers/CSS2DRenderer'
// 导入动画库
import * as TWEEN from '@tweenjs/tween.js'
// 导入hooks
import { useWindowSize, usePointer, useCameraTween } from '@/hooks'
import { useThree } from './hook/useThree.ts'
// 导入组件
import SLoading from '@/baseui/SLoading/index.vue'
import STag from './components/STag/index.vue'
// 导入类型
import type { ICunChu } from './types'

// 1.定义变量
const { width, height } = useWindowSize()
// 性能监视器
const statusRef = ref<HTMLDivElement | null>(null)
// 标签渲染
const tagRef = ref<HTMLDivElement | null>(null)
// 动画是否在播放
const isPlaying = ref<boolean>(false)
// 精灵个数
const N = 8000
// 当前环境中的效果，下雨/下雪
let currentEnvironemnt: string = ''
// 模型加载进度
const currentProgress = ref<number>(0)
// 是否加载进度条
const isLoading = ref<boolean>(true)
// 定时器
const timer = ref<number>(0)
// three变量
let scene: THREE.Scene | null,
  model: THREE.Group,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  css2Renderer: CSS2DRenderer,
  status: Status,
  controls: OrbitControls,
  mixer: THREE.AnimationMixer,
  clipAction: THREE.AnimationAction,
  spriteGroup: THREE.Group,
  selectModel: THREE.Object3D,
  cameraPos: THREE.Vector3,
  controlsTarget: THREE.Vector3
// 存储罐信息
const cunchuInfo: ICunChu = {
  设备A: {
    title: '设备A',
    counter: 200021,
    status: 0
  },
  设备B: {
    title: '设备B',
    counter: 19011,
    status: -1
  }
}
// 当前选择的存储罐
const currentSelectModel = ref<string>('')
// tag标签
let tag: CSS2DObject

const { initThree } = useThree()
onMounted(() => {
  const {
    scene: mScene,
    camera: mCamera,
    renderer: mRenderer,
    css2Renderer: mCss2Renderer,
    controls: mControls,
    status: mStatus,
    cameraPos: mCameraPos,
    controlsTarget: mControlsTarget
  } = initThree(document.getElementById('webgl') as HTMLCanvasElement)
  scene = mScene
  camera = mCamera
  status = mStatus
  controls = mControls
  renderer = mRenderer
  css2Renderer = mCss2Renderer
  cameraPos = mCameraPos
  controlsTarget = mControlsTarget
  // 添加性能监视器
  statusRef.value?.appendChild(mStatus.dom)
  // 添加css2DRenderer
  tagRef.value?.appendChild(css2Renderer.domElement)
  // 注册鼠标点击事件
  renderer.domElement.addEventListener('click', handlePointerClick)
  // 初始化标签
  initTag()
  // 加载模型
  initModel()
  // 播放动画
  animate()
})

// 加载模型
const initModel = () => {
  const loader = new GLTFLoader()
  loader.load(
    './models/factory.glb',
    (gltf) => {
      // 保存模型
      model = gltf.scene
      // 往场景中添加模型
      scene!.add(gltf.scene)
      // 播放关键帧动画
      mixer = new THREE.AnimationMixer(gltf.scene)
      // 获取gltf.animations[0]的第一个clip动画对象
      clipAction = mixer.clipAction(gltf.animations[0])
      // 播放动画
      clipAction.play()
      // 暂停状态
      clipAction.paused = true
      // 默认下雨效果
      handleEnvironment('rain')
    },
    (xhr) => {
      currentProgress.value = Number(Math.round((xhr.loaded / xhr.total) * 100))
      if (currentProgress.value === 100) {
        setTimeout(() => {
          isLoading.value = false
        }, 3000)
      }
    }
  )
}

// 模拟场景中下雨或者下雪的效果
const initRainOrSnow = (texture: THREE.Texture) => {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture
  })
  spriteGroup = new THREE.Group()
  scene!.add(spriteGroup)
  for (let i = 0; i < N; i++) {
    const sprite = new THREE.Sprite(spriteMaterial)
    spriteGroup.add(sprite)
    // 设置精灵模型位置，在长方体空间中随机分布
    const x = 1000 * (Math.random() - 0.5)
    const y = 600 * Math.random()
    const z = 1000 * (Math.random() - 0.5)
    sprite.position.set(x, y, z)
  }
}

// 渲染
const clock = new THREE.Clock()
const animate = () => {
  // 获取上下两针时间间隔
  const delta = clock.getDelta()
  // 渲染器渲染
  renderer && renderer.render(scene!, camera)
  // CSS2D
  css2Renderer && css2Renderer.render(scene!, camera)
  // 请求动画帧
  timer.value = requestAnimationFrame(animate)
  // 更新性能监视器
  status && status.update()
  // 更新相机控制器
  controls && controls.update()
  // 更新动画时间
  mixer && mixer.update(delta)
  // 更新TWEEN
  TWEEN.update()
  // 更新雨滴的位置
  if (spriteGroup) {
    spriteGroup.children.forEach((sprite) => {
      // 雨滴或者雪的y坐标每次减t*60
      sprite.position.y -= 50 * delta
      // 如果是下雪，改变雪花的姿态
      if (currentEnvironemnt === 'snow') {
        sprite.rotateZ(Math.PI * delta * 50)
      }
      if (sprite.position.y < 0) {
        sprite.position.y = 600
      }
    })
  }
}

// 播放动画
const handlePlay = () => {
  if (clipAction && clipAction.paused) {
    // 暂停状态
    clipAction.paused = false
    isPlaying.value = true
  } else {
    clipAction.paused = true
    isPlaying.value = false
  }
}

// 模拟下雨/下雪效果
const handleEnvironment = (type: string) => {
  // 1.判断场景中是否有下雨或者下雪的效果
  if (spriteGroup) {
    spriteGroup.traverse((item: any) => {
      if (item.type === 'Sprite') {
        item.material.dispose()
      }
    })
    scene!.remove(spriteGroup)
  }
  if (type === 'rain') {
    const texture: THREE.Texture = new THREE.TextureLoader().load(
      './images/sprite/rain.png'
    )
    currentEnvironemnt = 'rain'
    initRainOrSnow(texture)
  } else {
    const texture: THREE.Texture = new THREE.TextureLoader().load(
      './images/sprite/snow.png'
    )
    currentEnvironemnt = 'snow'
    initRainOrSnow(texture)
  }
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
  // 重新设置css2Renderer的尺寸
  if (css2Renderer) {
    css2Renderer.setSize(width, height)
  }
}

// 鼠标点击射线拾取
const handlePointerClick = (e: Event) => {
  // 转换鼠标点击坐标
  const { x, y } = usePointer(e)
  // 创建一个射线投射器
  const raycaster = new THREE.Raycaster()
  //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
  // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
  // 获取存储罐模型
  const cunchu = model.getObjectByName('存储罐')
  for (let i = 0; i < cunchu!.children.length; i++) {
    const group = cunchu?.children[i]
    group?.traverse((obj: any) => {
      if (obj.isMesh) {
        // 子对象增加ancestors属性，指向父对象，保证射线拾取时，选中的是整个父对象
        obj.ancestors = group
      }
    })
  }
  // 射线交叉计算拾取模型
  const intersects = raycaster.intersectObjects(cunchu!.children)
  if (intersects.length > 0) {
    selectModel = (intersects[0].object as any).ancestors as THREE.Object3D
    // 设置当前选中的模型的名称
    currentSelectModel.value = selectModel.name
    // 当前模型添加标签
    selectModel.add(tag)
    new TWEEN.Tween({ opacity: 0.0 })
      .to({ opacity: 1.0 })
      .onUpdate((obj) => {
        document.getElementById('tag')!.style.opacity =
          obj.opacity as unknown as string
      })
      .start()
    // 获取选中模型的世界坐标
    const selectModelworldPosition = new THREE.Vector3()
    selectModel.getWorldPosition(selectModelworldPosition)
    // 相机飞行到的位置和观察目标拉开一定距离
    const cameraPos = selectModelworldPosition.clone().addScalar(30)
    // 相机从当前位置camera.position飞行到三维场景中某个世界坐标附近
    createCameraTween(cameraPos, selectModelworldPosition)
  }
}

// 初始化标签
const initTag = () => {
  // 标签标注
  const div = document.getElementById('tag') as HTMLElement
  div.style.top = '-100px' //指示线端点放在标注点附近
  // HTML元素转化为threejs的CSS2模型对象
  tag = new CSS2DObject(div)
}

// 关闭标签
const handleClose = () => {
  if (selectModel) {
    new TWEEN.Tween({ opacity: 1.0 })
      .to({ opacity: 0.0 })
      .onUpdate((obj) => {
        document.getElementById('tag')!.style.opacity =
          obj.opacity as unknown as string
      })
      .onComplete(() => {
        selectModel.remove(tag)
      })
      .start()
    // 恢复完整视角
    createCameraTween(cameraPos, controlsTarget)
  }
}

// 创建相机动画
const createCameraTween = (endPos: THREE.Vector3, endTarget: THREE.Vector3) => {
  useCameraTween(camera.position, controls.target, endPos, endTarget)
    .onUpdate((obj) => {
      // 更新相机的位置坐标
      camera.position.set(obj.x, obj.y, obj.z)
      // 动态计算相机视线
      controls.target.set(obj.tx, obj.ty, obj.tz)
      controls.update() // 内部会执行.lookAt()，相当于执行相机的lookAt
    })
    .start()
}

watch(
  () => [width, height],
  ([newWidth, newHeight]) => {
    handleResize(newWidth.value, newHeight.value)
  },
  { immediate: true, deep: true }
)

onUnmounted(() => {
  // 移除renderer鼠标点击事件
  renderer.domElement.removeEventListener('click', handlePointerClick)
  renderer.domElement.remove()
  renderer.clear()
  scene!.traverse((item: any) => {
    if (item.isMesh) {
      item.geometry.dispose()
      item.material.dispose()
      if (item.texture) {
        item.texture.dispose()
      }
      scene!.remove(item)
    }
  })
  scene = null
  // 取消请求动画帧
  cancelAnimationFrame(timer.value)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
