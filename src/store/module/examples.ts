import { defineStore } from 'pinia'
// 导入类型
import type { ICard } from '@/type'
// 导入图片
import smartFactory from '@/assets/images/smart-factory.png'

const useExampleStore = defineStore('examples', () => {
  const exampleList = reactive<ICard[]>([
    {
      key: 1,
      title: '智慧工厂',
      img: smartFactory,
      desc: '智慧工厂，可实时监测最新状态，元宇宙漫游',
      path: 'SmartFactory'
    },
    {
      key: 2,
      title: '元宇宙',
      img: smartFactory,
      desc: '元宇宙，畅想无限未来',
      path: 'SmartFactory'
    },
    {
      key: 3,
      title: '元宇宙',
      img: smartFactory,
      desc: '元宇宙，畅想无限未来',
      path: 'SmartFactory'
    },
    {
      key: 4,
      title: '元宇宙',
      img: smartFactory,
      desc: '元宇宙，畅想无限未来元宇宙，畅想无限未来元宇宙，畅想无限未来元宇宙，畅想无限未来元宇宙，畅想无限未来',
      path: 'SmartFactory'
    }
  ])

  return {
    exampleList
  }
})

export default useExampleStore
