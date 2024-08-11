import * as YUKA from 'yuka'

/**
 * 创建路径path
 * @param path path数组
 */
export const useYukaPath = ({
  paths,
  loop = false
}: {
  paths: number[]
  loop?: boolean
}) => {
  const path = new YUKA.Path()
  for (let i = 0; i < paths.length; i += 3) {
    path.add(new YUKA.Vector3(...paths.slice(i, i + 3)))
  }
  // 设置路径是否循环
  path.loop = loop

  return path
}
