<template>
  <div class="tag" id="windowTag" style="display: none">
    <!-- 收费站标签信息背景图片 -->
    <img :src="infoBg" alt="" class="img" />
    <!-- 收费站名称 -->
    <div class="title">{{ windowTagInfo[name]?.shoufeizhan }}</div>
    <!-- 当天已经通车的次数 -->
    <span class="CarNum">{{ CarNum }}</span>
    <span style="font-size: 14px"> 车次 </span>
    <!-- 收费员 -->
    <span class="shouName">{{ windowTagInfo[name]?.shouName }}</span>
    <div class="shouNameId">
      工号：<span>{{ windowTagInfo[name]?.shouNameId }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入信息背景图片
import infoBg from '@/assets/images/info-bg.png'
// 导入类型
import type { IProps } from './types'
// 导入常量
import { windowTagInfo } from './constants'

// 0.定义props
const props = withDefaults(defineProps<IProps>(), {
  name: ''
})
const { name } = toRefs(props)

// 1.定义变量
const CarNum = ref<number>(0)

watch(
  () => name,
  (val) => {
    if (val.value !== '') {
      CarNum.value = 0
      // 数字滚动动画
      const interval = setInterval(function () {
        if (CarNum.value < windowTagInfo[val.value]?.CarNum) {
          CarNum.value += Math.floor(windowTagInfo[val.value]?.CarNum / 50)
        } else {
          // 一旦达到当日通车数量，取消周期性函数interval
          clearInterval(interval)
        }
      }, 5)
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
