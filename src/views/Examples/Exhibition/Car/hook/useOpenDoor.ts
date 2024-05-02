import * as THREE from 'three'
// 导入hook
import { usePointer, useRayCaster } from '@/hooks'
import { useOpenCarDoorTween, useDoorVoice } from './'

const { openSound, closeSound } = useDoorVoice()

export const useOpenDoor = (
  model: THREE.Group,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera
) => {
  const tagNameArr = [
    '右前光标',
    '右后光标',
    '左前光标',
    '左后光标',
    '后备箱光标'
  ]
  const doorNameArr = ['右前门', '右后门', '左前门', '左后门', '后备箱']
  const chooseArr: THREE.Sprite[] = []
  tagNameArr.forEach((name, index) => {
    // 1.获取热点模型Sprite
    const spriteObj = model.getObjectByName(name)?.children[0] as any
    chooseArr.push(spriteObj)
    // 2.获取车门
    const carDoor = model.getObjectByName(doorNameArr[index])
    // 3.绑定光标属性，指向车门
    spriteObj!.door = carDoor
    spriteObj!.door.state = 'close' // 默认车门关闭
    // 4.给车门绑定动画
    const door = carDoor as any
    const doorName = door?.name
    if (doorName === '左前门' || doorName === '左后门') {
      door!.openTween = useOpenCarDoorTween('y', 0, -Math.PI / 3, door)
      door!.closeTween = useOpenCarDoorTween('y', -Math.PI / 3, 0, door)
    } else if (doorName === '右前门' || doorName === '右后门') {
      door!.openTween = useOpenCarDoorTween('y', 0, Math.PI / 3, door)
      door!.closeTween = useOpenCarDoorTween('y', Math.PI / 3, 0, door)
    } else if (doorName == '后备箱') {
      door.openTween = useOpenCarDoorTween('z', 0, Math.PI / 3, door)
      door.closeTween = useOpenCarDoorTween('z', Math.PI / 3, 0, door)
    }
  })

  // 射线拾取
  const handlePointerClick = (e: Event) => {
    // 1.转换坐标
    const { x, y } = usePointer(e)
    // 2.射线拾取
    const chooseObj = useRayCaster({
      x,
      y,
      camera,
      chooseObjArr: chooseArr
    }) as any
    if (chooseObj) {
      // 选中的车门
      const chooseDoor = chooseObj.door
      if (chooseDoor.state === 'close') {
        chooseDoor.state = true
        chooseDoor.openTween.start()
        chooseDoor.openTween.onStart(() => {
          // 播放开门声音
          openSound.play()
        })
      } else {
        chooseDoor.state = 'close'
        chooseDoor.closeTween.start()
        chooseDoor.closeTween.onStart(() => {
          // 播放关门声音
          closeSound.play()
        })
      }
    }
  }
  // 注册鼠标点击事件
  renderer.domElement.addEventListener('click', handlePointerClick)
}
