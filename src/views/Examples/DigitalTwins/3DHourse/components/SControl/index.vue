<template>
  <div class="s-controls">
    <!-- 漫游 -->
    <el-button
      v-for="(btn, index) in buttons"
      :key="index"
      round
      plain
      size="large"
      @click="changeRoom(btn.name)"
    >
      {{ btn.name }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
// 0.定义props和emits
const emits = defineEmits(['changeRoom'])

const buttons = [
  {
    name: '客厅'
  },
  {
    name: '厨房'
  },
  {
    name: '阳台'
  },
  {
    name: '主卧'
  },
  {
    name: '儿童房'
  },
  {
    name: '老人房'
  },
  {
    name: '走廊'
  }
]

const changeRoom = (name: string) => {
  emits('changeRoom', name)
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
