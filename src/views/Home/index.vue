<template>
  <div class="home">
    <el-container>
      <Header />
      <el-main>
        <!-- 轮播图 -->
        <Swiper />
        <!-- threejs案例 -->
        <STitle title="作品集" />
        <div class="example-list" v-if="isRender">
          <SCard
            v-for="item in exampleList"
            :key="item.key"
            :card="item"
            :column="column"
          />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
// 导入组件
import Header from '@/components/Header/index.vue'
import Swiper from '@/components/Swiper/index.vue'
import STitle from '@/baseui/STitle/index.vue'
import SCard from '@/baseui/SCard/index.vue'
// 导入类型
import type { ICard } from '@/type'
import room from '@/assets/images/3d-lianwang.jpeg'
// 导入hook
import { useWindowSize } from '@/hooks'

const { width } = useWindowSize()
// 是否渲染作品card
const isRender = ref<boolean>(true)
// 每行展示几个作品
const column = ref(5)

watch(
  () => width,
  (val) => {
    isRender.value = false
    if (val.value < 300) {
      column.value = 1
    } else if (val.value < 550) {
      column.value = 2
    } else if (val.value < 800) {
      column.value = 3
    } else if (val.value < 1200) {
      column.value = 4
    } else {
      column.value = 5
    }
    setTimeout(() => {
      isRender.value = true
    }, 0)
  },
  { immediate: true, deep: true }
)

const exampleList = reactive<ICard[]>([
  {
    key: 1,
    title: '元宇宙',
    img: room,
    desc: '元宇宙，畅想无限未来'
  },
  {
    key: 2,
    title: '元宇宙',
    img: room,
    desc: '元宇宙，畅想无限未来'
  },
  {
    key: 3,
    title: '元宇宙',
    img: room,
    desc: '元宇宙，畅想无限未来'
  },
  {
    key: 4,
    title: '元宇宙',
    img: room,
    desc: '元宇宙，畅想无限未来元宇宙，畅想无限未来元宇宙，畅想无限未来元宇宙，畅想无限未来元宇宙，畅想无限未来'
  },
  {
    key: 5,
    title: '元宇宙',
    img: room,
    desc: '元宇宙，畅想无限未来'
  }
])
</script>

<style lang="less" scoped>
@import './index.less';
</style>
