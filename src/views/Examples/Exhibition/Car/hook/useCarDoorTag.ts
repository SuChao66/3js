import * as THREE from 'three'

/**
 * 创建车门精灵标签
 * @param model
 */
export const useCarDoorTag = (model: THREE.Group) => {
  const S = 30
  const tagNames = [
    '右前光标',
    '右后光标',
    '左前光标',
    '左后光标',
    '后备箱光标'
  ]
  const tags: THREE.Sprite[] = []
  tagNames.forEach((name: string) => {
    // 1.获取模型
    const tag = model.getObjectByName(name)
    // 2.创建精灵
    const spriteMaterial = new THREE.SpriteMaterial({
      color: 0x00ffff,
      map: new THREE.TextureLoader().load('./images/sprite/光点.png'), //设置精灵纹理贴图
      transparent: true
    })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(S, S, 1) //大小设置
    // 3.将精灵添加至模型中
    tag?.add(sprite)
    // 4.根据sprite大小平移，任意观察角度都避免精灵插入到车体内
    if (name === '左前光标' || name == '左后光标') {
      sprite.position.z += sprite.scale.x / 2
    } else if (name == '右前光标' || name == '右后光标') {
      sprite.position.z -= sprite.scale.x / 2
    } else if (name === '后备箱光标') {
      sprite.position.x += sprite.scale.x / 2
    }
    tags.push(sprite)
  })

  // 设置标注精灵Sprite波动，提示用户点击
  let s = 0.0
  const scale = S //原来缩放倍数大小
  function waveAnimation() {
    // 设置产品模型旋转动画
    s += 0.01
    tags.forEach(function (sprite) {
      if (s < 0.5) {
        sprite.scale.x = scale * (1 + s)
        sprite.scale.y = scale * (1 + s)
      } else if (s >= 0.5 && s < 1.0) {
        sprite.scale.x = scale * (2 - s)
        sprite.scale.y = scale * (2 - s)
      } else {
        s = 0.0
      }
    })
    requestAnimationFrame(waveAnimation)
  }
  waveAnimation()
}
