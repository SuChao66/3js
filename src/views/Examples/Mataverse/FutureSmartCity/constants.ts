import * as THREE from 'three'

// 相机的位置坐标
export const cameraPos = new THREE.Vector3(0, 10, 50)
// 相机的朝向
export const cameraTarget = new THREE.Vector3(0, 0, 0)
// 第一人称相机
export const firstPersonPerspectiveCamera = new THREE.Vector3(0, 1, 1)
// 第三人称相机
export const thirdPersonPerspectiveCamera = new THREE.Vector3(0, 1, -5)
