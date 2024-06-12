<template>
  <div class="banner">
    <img :src="bannerLogo" alt class="logo" />
  </div>
</template>

<script setup lang="ts">
import bannerLogo from '@/assets/images/banner-logo.png'
</script>

<style lang="less" scoped>
@import './index.less';
</style>
