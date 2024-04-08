<template>
  <el-header>
    <el-row>
      <el-col :span="14" class="left">{{ global.title }}</el-col>
      <el-col :span="10" class="right">
        <!-- 中英文 -->
        <Locale />
        <!-- 主题 -->
        <STheme />
        <!-- github -->
        <SGitHub />
      </el-col>
    </el-row>
  </el-header>
</template>

<script setup lang="ts">
import Locale from '../Locale/index.vue'
import STheme from '../STheme/index.vue'
import SGitHub from '../SGitHub/index.vue'
import { useStore } from '@/store'

const { global } = useStore()
</script>

<style lang="less" scoped>
@import './index.less';
</style>
