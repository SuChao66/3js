<template>
  <div class="color-choose">
    <div
      class="colorChoose"
      v-for="color in colors"
      :key="color.key"
      @click="handleColor(color.key)"
    >
      <img :src="color.img" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入图片
import green from '../../assets/green.jpg'
import gray from '../../assets/gray.jpg'
import red from '../../assets/red.jpg'
import black from '../../assets/black.jpg'
import white from '../../assets/white.jpg'

const emit = defineEmits(['handleColor'])

const colors = [
  { img: green, key: 0 },
  { img: gray, key: 1 },
  { img: red, key: 2 },
  { img: black, key: 3 },
  { img: white, key: 4 }
]

const handleColor = (key: number) => {
  emit('handleColor', key)
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
