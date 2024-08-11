import * as YUKA from 'yuka'

/**
 * 加载导航网格
 * @returns
 */
export const useNavMesh = ({ path }: { path: string }) => {
  return new Promise((resolve) => {
    const navMeshLoader = new YUKA.NavMeshLoader()
    navMeshLoader.load(path).then((navigationMesh: any) => {
      resolve(navigationMesh)
    })
  })
}
