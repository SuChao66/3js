<template>
  <div class="lane-label" style="display: none">
    <!-- 给每个收费窗口标注一个CSS3标签：标注收费窗口序号 -->
    <div class="numTag" v-for="(num, i) in lanNum" :key="i" :id="'CD' + i">
      0{{ num }}
    </div>
  </div>
</template>

<script setup lang="ts">
// 车道数
const lanNum = reactive<number[]>([1, 2, 3, 4, 5, 6, 7, 8])
</script>

<style lang="less" scoped>
@import './index.less';
</style>
