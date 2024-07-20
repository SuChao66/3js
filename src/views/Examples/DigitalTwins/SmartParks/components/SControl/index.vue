<template>
  <div class="s-controls">
    <div class="left">
      <el-button
        v-for="(btn, index) in leftButtons"
        :key="index"
        round
        plain
        size="large"
        @click="handleBtnClick(btn.key)"
      >
        {{ btn.name }}
      </el-button>
    </div>
    <div class="right">
      <el-button
        v-for="(btn, index) in rightButtons"
        :key="index"
        round
        plain
        size="large"
        @click="handleBtnClick(btn.key)"
      >
        {{ btn.name }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 0.定义props和emits
const emits = defineEmits(['handleBtnClick'])

const leftButtons = [
  {
    name: '厂房外形展示',
    key: 'showWall'
  },
  {
    name: '厂房分层展开',
    key: 'showAll'
  },
  {
    name: '关闭分层展开',
    key: 'hideAll'
  },
  {
    name: '展示第一层楼',
    key: 'showFloor1'
  },
  {
    name: '展示第二层楼',
    key: 'showFloor2'
  }
]
const rightButtons = [
  {
    name: '展开飞机',
    key: 'flatFighter'
  },
  {
    name: '恢复飞机',
    key: 'recoverFighter'
  },
  {
    name: '飞机粒子',
    key: 'pointsFighter'
  },
  {
    name: '粒子爆炸',
    key: 'pointsBlast'
  },
  {
    name: '粒子复原',
    key: 'pointsBack'
  }
]

const handleBtnClick = (key: string) => {
  emits('handleBtnClick', key)
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
