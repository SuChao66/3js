import { defineStore } from 'pinia'

const useCounterStore = defineStore(
  'counter',
  () => {
    const count = ref(0)
    const increment = () => count.value++
    return {
      count,
      increment
    }
  }
  // { persist: true }
)

export default useCounterStore
