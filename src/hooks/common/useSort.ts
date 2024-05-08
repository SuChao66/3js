/**
 * 数组排序
 * @param num1
 * @param num2
 * @returns
 */
export const useSort = (num1: number, num2: number) => {
  if (num1 < num2) {
    return -1
  } else if (num1 > num2) {
    return 1
  } else {
    return 0
  }
}
