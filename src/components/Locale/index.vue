<template>
  <div class="container">
    <el-dropdown @command="handleCommand">
      <div class="locale">
        <span class="title">{{ currentLocale }}</span>
        <svg-icon icon-class="locale"></svg-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in locales"
            :key="index"
            :command="item.key"
          >
            {{ item.title }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@/store'

const { global } = useStore()

const locales = reactive([
  { key: 'chinese', title: '中文' },
  { key: 'english', title: '英文' }
])
const currentLocale = computed(() => {
  return locales.filter((item) => item.key === global.locale)[0].title
})
const handleCommand = (command: string) => {
  global.SET_LOCALE(command)
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
