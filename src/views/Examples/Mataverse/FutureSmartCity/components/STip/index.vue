<template>
  <div class="s-tip">
    MOUSE to look around and travel the world<br />
    Move: WASD<br />
    Jump: SPACE<br />
    Look: MOUSE<br />
    <el-button class="play-btn" type="primary" round @click="handleStart"
      >开始</el-button
    >
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['handleStart'])

const handleStart = () => {
  emit('handleStart')
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
