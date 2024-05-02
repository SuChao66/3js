import * as THREE from 'three'

// 修改汽车的材质
export const useCarMaterial = (model: THREE.Group) => {
  let gaoGuangJinShu: any
  model.traverse((obj: any) => {
    if (obj.type === 'Mesh') {
      // 设置车架外面金属框、轮毂的材质
      if (obj.name.slice(0, 4) == '高光金属') {
        gaoGuangJinShu = obj
        gaoGuangJinShu.material = new THREE.MeshStandardMaterial({
          color: obj.material.color,
          metalness: 1.0, // 金属度
          roughness: 0.2, // 粗糙度
          envMapIntensity: 1.0 // 控制环境贴图的影响
        })
      } else if (obj.name.slice(0, 2) == '外壳') {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: obj.material.color, //默认颜色
          clearcoat: 1, // 清漆层
          clearcoatRoughness: 0.01, // 清漆层的粗糙度
          metalness: 0.9, // 金属度
          roughness: 0.5, // 粗糙度
          envMapIntensity: 2.5 // 环境贴图强度
        })
      } else if (obj.name.slice(0, 2) == '玻璃') {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: 0x000000, // 玻璃颜色
          metalness: 0, // 金属度
          roughness: 0, // 粗糙度
          transparent: true, // 透明
          transmission: 0.5 //透光率
        })
      } else if (obj.name.slice(0, 3) == '后视镜') {
        obj.material = new THREE.MeshStandardMaterial({
          color: 0xffffff, //白色
          metalness: 1.0, // 金属度
          roughness: 0.0, // 粗糙度
          envMapIntensity: 1.0
        })
      } else if (obj.name.slice(0, 2) == '轮胎') {
        obj.material.color.set(0x000000)
        obj.material.normalScale.set(2, 2) //加强法线贴图凹凸效果
        obj.material.metalness = 0.0
        obj.material.roughness = 0.6
      } else if (obj.name.slice(0, 3) == '前灯罩') {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0,
          roughness: 0,
          envMapIntensity: 1.0,
          transmission: 0.9, // 透光率
          transparent: true
        })
      } else if (obj.name.slice(0, 4) == '尾灯灯罩') {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: 0xff0000,
          metalness: 0,
          roughness: 0,
          transmission: 0.5,
          transparent: true,
          envMapIntensity: 2.5
        })
      } else if (obj.name.slice(0, 5) == '尾灯第二层') {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: 0x440000,
          metalness: 0,
          roughness: 0,
          transmission: 0.5,
          transparent: true
        })
      } else if (obj.name.slice(0, 4) == '尾灯发光') {
        obj.material = new THREE.MeshLambertMaterial({
          color: 0x660000
        })
      } else if (obj.name.slice(0, 5) == '尾灯第三层') {
        obj.material = new THREE.MeshLambertMaterial({
          color: 0x19190000
        })
      } else if (obj.name.slice(0, 2) == '塑料') {
        obj.material = new THREE.MeshPhysicalMaterial({
          color: 0x010101,
          metalness: 0.0,
          roughness: 0.8,
          envMapIntensity: 1.0
        })
      }
      ;(model.getObjectByName('天窗黑玻璃') as any).material =
        new THREE.MeshPhysicalMaterial({
          color: 0x00000,
          metalness: 0,
          roughness: 0,
          envMapIntensity: 1.0,
          transmission: 0.2, // .transmission属性用于设置玻璃材质
          transparent: true
        })
      ;(model.getObjectByName('车座') as any).material =
        new THREE.MeshPhysicalMaterial({
          color: 0x020202,
          metalness: 0.0,
          roughness: 0.6,
          envMapIntensity: 1.0
        })
    }
  })
}
