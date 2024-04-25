import * as THREE from 'three'
// 导入hook
import { useSprite } from '@/hooks'
// 导入hooks
import { useDangGanTween } from './index'

/**
 * 创建挡杆热点精灵
 */
export const usePointTag = (model: any) => {
  // 精灵模型
  const spriteArr: THREE.Sprite[] = []
  // 挡杆模型
  const dangGanArr: any[] = []

  for (let i = 0; i < 8; i++) {
    // 1.获取挡杆模型
    const gz = model.getObjectByName('GZ00' + (i + 1))
    // 2.创建精灵，并播放精灵动画
    const sprite = useSprite({
      path: './images/sprite/光点.png',
      animation: true
    }) as any
    // 3.创建一个包围盒
    const box3 = new THREE.Box3()
    // 计算挡杆模型的最小包围盒
    box3.expandByObject(gz)
    // 计算包围盒尺寸
    const scale = new THREE.Vector3()
    box3.getSize(scale)
    // 4.根据包围盒的尺寸，移动热点精灵到合适的位置
    sprite.position.x += scale.x * 0.7
    sprite.position.z += 0.5
    // 5.设置精灵的序号
    sprite.i = i
    spriteArr.push(sprite)
    // 6.模型添加精灵
    gz.add(sprite)
    // 自定义一个open属性，用来表示挡杆的开启状态
    gz.open = false
    // 创建挡杆抬起和关闭的动画
    useDangGanTween(gz)
    dangGanArr.push(gz)
  }

  return { spriteArr, dangGanArr }
}
