<template>
  <div id="carTag" class="tag" style="display: none">
    <div class="container">
      <div>车牌号</div>
      <div>{{ car.num || '浙A60KZ3' }}</div>
    </div>
    <div class="container">
      <div>司机</div>
      <div>{{ car.driverName || 'sc' }}</div>
    </div>
    <div class="container">
      <div>车型</div>
      <div>{{ car.carType || '轿车' }}</div>
    </div>
    <div class="container">
      <div>状态</div>
      <div v-if="car.state == '正常'" style="color: #00ff00">
        {{ car.state }}
      </div>
      <div v-if="car.state == '异常'" style="color: #ffff00">
        {{ car.state }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
// 导入类型
import type { IProps } from './types'

const props = withDefaults(defineProps<IProps>(), {
  car: null
})
const { car } = toRefs(props)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
