/**
 * 创建tag
 * @param name
 */
export const useTag = (name: string) => {
  const div = document.createElement('div') as HTMLDivElement
  div.innerHTML = name
  div.style.padding = '5px 10px'
  div.style.color = '#fff'
  div.style.fontSize = '16px'
  // div.style.position = 'absolute'
  div.style.backgroundColor = 'rgba(0,0,0,0.2)'
  div.style.borderRadius = '5px'

  return div
}
