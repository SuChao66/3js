<template>
  <div class="container">
    <el-button-group>
      <el-button round plain>
        <svg-icon className="icon" icon-class="sunLight" :size="16"></svg-icon>
        Light
      </el-button>
      <el-button round plain>
        <svg-icon className="icon" icon-class="moonLight" :size="16"></svg-icon>
        Dark
      </el-button>
    </el-button-group>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@import './index.less';
</style>
