<template>
  <div class="cesium">
    <el-container>
      <el-main>
        <CesiumExamples :column="column" :isRender="isRender" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// 导入hook
import { useWindowSize } from '@/hooks'
// 导入组件
import CesiumExamples from './modules/CesiumExamples/index.vue'
// 导入store
import { useStore } from '@/store'

const { global } = useStore()
const { width } = useWindowSize()
// 是否渲染作品card
const isRender = ref<boolean>(true)
// 每行展示几个作品
const column = ref(4)

watch(
  () => width,
  (val) => {
    isRender.value = false
    if (val.value < 400) {
      column.value = 1
      global.SET_IS_SHOW_HEADER_RIGHT(false)
    } else if (val.value < 700) {
      column.value = 2
      global.SET_IS_SHOW_HEADER_RIGHT(false)
    } else if (val.value < 1000) {
      column.value = 3
      global.SET_IS_SHOW_HEADER_RIGHT(false)
    } else {
      column.value = 4
      global.SET_IS_SHOW_HEADER_RIGHT(true)
    }
    setTimeout(() => {
      isRender.value = true
    }, 0)
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
