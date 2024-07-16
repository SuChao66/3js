<template>
  <div class="home">
    <el-container>
      <Header :isShowRight="isShowRight" />
      <el-main>
        <VideoBg />
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
// 导入组件
import Header from '@/components/Header/index.vue'
import VideoBg from '@/components/VideoBg/index.vue'
// 导入store
import { useStore } from '@/store'

const { global } = useStore()

// 是否展示顶部右侧内容
const isShowRight = computed(() => {
  return global.isShowHeaderRight
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
