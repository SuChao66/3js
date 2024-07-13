/**
 * 将鼠标点击坐标转换为three坐标
 * @param event
 * @returns
 */
export const usePointer = (event: any) => {
  const px = event.offsetX
  const py = event.offsetY
  // 将屏幕坐标转换为three坐标
  const x = (px / window.innerWidth) * 2 - 1
  const y = -(py / window.innerHeight) * 2 + 1

  return {
    x,
    y
  }
}
