<template>
  <div class="home">
    <el-container>
      <Header />
      <el-main>
        <Swiper />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import Header from '@/components/Header/index.vue'
import Swiper from '@/components/Swiper/index.vue'
</script>

<style lang="less" scoped>
@import './index.less';
</style>
