<template>
  <div class="controls">
    <div class="out">
      <span class="in">{{ allOpen ? '全关' : '全开' }}</span>
      <el-switch v-model="allOpen" />
    </div>
    <div class="out" v-for="(dangGan, index) in dangGans" :key="index">
      <span class="in">0{{ index + 1 }}</span>
      <el-switch
        v-model="dangGanStatus[index]"
        @change="handleBtnClick(index, dangGan)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref } from 'vue'
// 导入类型
import type { IProps } from './types'

// 0.定义props和emits
const emit = defineEmits(['handleSpriteClick'])
const props = withDefaults(defineProps<IProps>(), {
  dangGans: () => []
})
const { dangGans } = toRefs(props)

// 1.定义变量
// 是否全开
const allOpen = ref<boolean>(false)
// 每一个挡杆的状态值
const dangGanStatus = ref<boolean[]>([])

// 监听挡杆的值，初始化挡杆动画和状态
watch(
  () => dangGans,
  (val) => {
    if (val.value.length > 0) {
      dangGanStatus.value = []
      val.value.forEach((dangGan) => {
        // 1.初始化挡杆的状态
        dangGanStatus.value.push(dangGan.open)
      })
    }
  },
  { immediate: true, deep: true }
)

// 全开/全关
watch(
  () => allOpen,
  (val) => {
    if (val.value) {
      // 全开
      for (let i = 0; i < 8; i++) {
        const gz = dangGans.value[i]
        // 执行打开动画
        gz.openTween.start()
        // 修改挡杆状态
        gz.open = true
        dangGanStatus.value[i] = true
      }
    } else {
      // 全关
      for (let i = 0; i < 8; i++) {
        const gz = dangGans.value[i]
        // 执行关闭动画
        gz.closeTween.start()
        // 修改挡杆状态
        gz.open = false
        dangGanStatus.value[i] = false
      }
    }
  },
  { immediate: true, deep: true }
)

// 按钮点击
const handleBtnClick = (index: number, model: any) => {
  // 1.修改模型挡杆的状态
  model.open = dangGanStatus.value[index]
  // 2.执行动画
  if (model.open) {
    model.openTween.start()
  } else {
    model.closeTween.start()
  }
}

// 精灵点击，射线拾取
const handleWindowClick = (e: Event) => {
  emit('handleSpriteClick', e)
}

onMounted(() => {
  document.addEventListener('click', handleWindowClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleWindowClick)
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
