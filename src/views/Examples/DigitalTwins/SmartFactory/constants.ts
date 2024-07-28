import * as THREE from 'three'
// 导入类型
import type { ICunChu } from './types'

// 存储罐信息
export const cunchuInfo: ICunChu = {
  设备A: {
    title: '设备A',
    counter: 200021,
    status: 0
  },
  设备B: {
    title: '设备B',
    counter: 19011,
    status: -1
  }
}

// 第一人称相机
export const firstPersonPerspectiveCamera = new THREE.Vector3(0, 0.15, 1)
// 第三人称相机
export const thirdPersonPerspectiveCamera = new THREE.Vector3(0, 0.15, -5)
