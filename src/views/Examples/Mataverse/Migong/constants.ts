import * as THREE from 'three'

// 相机的位置坐标
export const cameraPos = new THREE.Vector3(-95, 1.6, -77)
// 相机的朝向
export const cameraTarget = new THREE.Vector3(0, 0, 0)
// 玩家位置
export const playerPosition = new THREE.Vector3(0, -0.65, 0)
// NPC位置
export const girlPosition = new THREE.Vector3(0.5, -0.45, 8)
// 第一人称相机
export const firstPersonPerspectiveCamera = new THREE.Vector3(0, 0.25, 1.8)
// 第三人称相机
export const thirdPersonPerspectiveCamera = new THREE.Vector3(0, 0.25, -1.8)
// 玩家聊天内容
export const playerChatTexts = [
  '谁在那里？',
  '我们又见面了，你是谁，这是什么地方',
  '我已经在这转了好几圈了，你能告诉我怎么出去吗？'
]
// NPC回复话术
export const girlChatTexts = [
  '你能看见我吗？呵呵呵呵～',
  '这是一个你来了永远也出不去的地方，哈哈哈哈',
  '别幻想了，陪我在这待一辈子吧！'
]
