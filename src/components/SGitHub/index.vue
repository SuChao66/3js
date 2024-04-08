<template>
  <div class="container">
    <svg-icon @click="handleGitHub" icon-class="githubLight"></svg-icon>
  </div>
</template>

<script setup lang="ts">
const handleGitHub = () => {
  window.open('https://github.com/SuChao66/3js')
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
