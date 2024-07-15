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

const { width } = useWindowSize()
// 是否渲染作品card
const isRender = ref<boolean>(true)
// 每行展示几个作品
const column = ref(4)
// 是否展示顶部右侧内容
const isShowRight = ref<boolean>(true)

watch(
  () => width,
  (val) => {
    isRender.value = false
    if (val.value < 400) {
      column.value = 1
    } else if (val.value < 700) {
      column.value = 2
      isShowRight.value = false
    } else if (val.value < 1000) {
      column.value = 3
      isShowRight.value = true
    } else {
      column.value = 4
      isShowRight.value = true
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
