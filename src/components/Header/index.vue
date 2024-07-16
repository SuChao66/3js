<template>
  <el-header>
    <el-row>
      <el-col :span="isShowRight ? 10 : 12" class="left">
        <img :src="logo" alt="" class="logo" />
        {{ global.title }}
      </el-col>
      <el-col :span="isShowRight ? 4 : 12" class="middle" v-if="isShowRight">
        <div
          v-for="button in buttons"
          :key="button.title"
          :class="button.path === active ? 'active' : ''"
          @click="handleBtnClick(button.path)"
        >
          {{ button.title }}
        </div>
      </el-col>
      <el-col :span="isShowRight ? 4 : 12" class="right" v-if="!isShowRight">
        <el-dropdown @command="handleBtnClick">
          <div class="locale">
            <svg-icon icon-class="more"></svg-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in buttons"
                :key="index"
                :command="item.path"
              >
                {{ item.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
      <el-col :span="10" class="right" v-if="isShowRight">
        <!-- 中英文 -->
        <Locale />
        <!-- 主题 -->
        <STheme />
        <!-- github -->
        <SGitHub />
      </el-col>
    </el-row>
  </el-header>
</template>

<script setup lang="ts">
// 导入组件
import Locale from '../Locale/index.vue'
import STheme from '../STheme/index.vue'
import SGitHub from '../SGitHub/index.vue'
// 导入图片
import logo from '@/assets/images/logo.jpg'
// 导入store
import { useStore } from '@/store'
// 导入类型
import type { IProps } from './types'
// 导入路由
import { useRouter, useRoute } from 'vue-router'

const { global } = useStore()

const props = withDefaults(defineProps<IProps>(), {
  isShowRight: true
})
const { isShowRight } = toRefs(props)

const route = useRoute()
const router = useRouter()
const active = ref<string>('')
const buttons = ref([
  {
    title: 'THREE',
    key: 'three',
    path: 'three'
  },
  {
    title: 'CESIUM',
    key: 'cesium',
    path: 'cesium'
  }
])

// 路由跳转
const handleBtnClick = (path: string) => {
  if (!path) return
  router.push({
    path: path
  })
}

watch(
  () => route.path,
  (val) => {
    nextTick(() => {
      const currentBtn = buttons.value.find((btn) => `/${btn.path}` === val)
      active.value = currentBtn!.path
    })
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
@import './index.less';
</style>
