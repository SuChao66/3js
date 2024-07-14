<template>
  <el-header>
    <el-row>
      <el-col :span="11" class="left">
        <img :src="logo" alt="" class="logo" />
        {{ global.title }}
      </el-col>
      <el-col :span="2" class="middle">
        <div
          v-for="button in buttons"
          :key="button.name"
          :class="button.path === active ? 'active' : ''"
          @click="handleBtnClick(button.path)"
        >
          {{ button.name }}
        </div>
      </el-col>
      <el-col :span="11" class="right">
        <!-- 中英文 -->
        <Locale />
        <!-- 主题 -->
        <STheme v-if="isShowRight" />
        <!-- github -->
        <SGitHub />
      </el-col>
    </el-row>
  </el-header>
</template>

<script setup lang="ts">
// 导入组件
import Locale from '../Locale/index.vue'
import STheme from '../STheme/index.vue'
import SGitHub from '../SGitHub/index.vue'
// 导入图片
import logo from '@/assets/images/logo.jpg'
// 导入store
import { useStore } from '@/store'
// 导入类型
import type { IProps } from './types'
// 导入路由
import { useRouter, useRoute } from 'vue-router'

const { global } = useStore()

const props = withDefaults(defineProps<IProps>(), {
  isShowRight: true
})
const { isShowRight } = toRefs(props)

const route = useRoute()
const router = useRouter()
const active = ref<string>('')
const buttons = ref([
  {
    name: 'THREE',
    path: '3js'
  },
  {
    name: 'CESIUM',
    path: 'cesium'
  }
])

// 路由跳转
const handleBtnClick = (path: string) => {
  if (!path) return
  router.push({
    path: path
  })
}

watch(
  () => route.path,
  (val) => {
    nextTick(() => {
      const currentBtn = buttons.value.find((btn) => `/${btn.path}` === val)
      active.value = currentBtn!.path
    })
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
