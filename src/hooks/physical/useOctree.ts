import * as THREE from 'three'
// 导入八叉树
import { Octree } from 'three/examples/jsm/math/Octree.js'
// 八叉树可视化
import { OctreeHelper } from 'three/examples/jsm/helpers/OctreeHelper.js'
// 导入胶囊
import { Capsule } from 'three/examples/jsm/math/Capsule.js'

/**
 * 使用八叉树实现物理碰撞
 * @param isShowHelper 是否展示辅助器
 * @param planeGroup 碰撞组
 */
export const useOctree = ({
  isShowHelper = false,
  planeGroup,
  start = new THREE.Vector3(0, 0.35, 0),
  end = new THREE.Vector3(0, 1, 0),
  radius = 0.35
}: {
  isShowHelper?: boolean
  planeGroup: THREE.Group
  start?: THREE.Vector3
  end?: THREE.Vector3
  radius?: number
}) => {
  // 0.定义变量
  let octreeHelper
  // 1.实例化八叉树
  const worldOctree = new Octree()
  // 2.分割碰撞组
  worldOctree.fromGraphNode(planeGroup)
  // 3.创建一个octreeHelper
  if (isShowHelper) {
    octreeHelper = new OctreeHelper(worldOctree, '0xffff00')
  }
  // 4.创建一个胶囊体
  const capsule = new Capsule(start, end, radius)

  return {
    worldOctree,
    capsule
  }
}
