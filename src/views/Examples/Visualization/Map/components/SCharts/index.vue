<template>
  <div class="left charts">
    <SBox class="box">
      <div class="chart" id="echart1"></div>
    </SBox>
    <SBox class="box">
      <div class="chart" id="echart2"></div>
    </SBox>
    <SBox class="box">
      <div class="chart" id="echart3"></div>
    </SBox>
  </div>

  <div class="right charts">
    <SBox class="box">
      <div class="chart" id="echart4"></div>
    </SBox>
    <SBox class="box">
      <div class="chart" id="echart5"></div>
    </SBox>
    <SBox class="box">
      <div class="chart" id="echart6"></div>
    </SBox>
  </div>
</template>

<script setup lang="ts">
import SBox from '@/baseui/SBox/index.vue'
// 导入chart
import linedan from '../../charts/linedan.ts'
import line from '../../charts/line.ts'
import ring from '../../charts/ring.ts'
import shuizhu from '../../charts/shuizhu.ts'
import shuzhu from '../../charts/shuzhu.ts'
import water from '../../charts/water.ts'
import circle from '../../charts/circle.ts'

onMounted(() => {
  line('echart1')
  shuizhu('echart2')
  water('echart3')
  linedan('echart4')
  circle('echart5')
  shuzhu('echart6')
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
