// 导入hook
import { useSort } from './useSort'

/**
 * 获取数据中的最大值、最小值
 * @param arr
 */
export const useMinMax = (arr: number[]) => {
  // 数组元素排序
  arr.sort(useSort)
  // 返回最大值和最小值
  return [Math.floor(arr[0]), Math.ceil(arr[arr.length - 1])]
}
