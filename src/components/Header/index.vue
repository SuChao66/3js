<template>
  <el-header>
    <el-row>
      <el-col :span="14" class="left">
        <img :src="logo" alt="" class="logo" />
        {{ global.title }}
      </el-col>
      <el-col :span="10" class="right">
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

const { global } = useStore()

const props = withDefaults(defineProps<IProps>(), {
  isShowRight: true
})
const { isShowRight } = toRefs(props)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
