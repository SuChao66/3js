import * as THREE from 'three'
import { useLon2xyz } from '@/hooks'

// 矩形平面网格模型设置背景透明的png贴图
const geometry = new THREE.PlaneGeometry(1, 1) //默认在XOY平面上
const textureLoader = new THREE.TextureLoader() // TextureLoader创建一个纹理加载器对象
const texture = textureLoader.load('./images/planets/circle.png')

/**
 * 绘制波动光圈
 * @param R 半径
 * @param lon 经度
 * @param lat 纬度
 * @returns
 */
const useWaveMesh = (R: number, lon: number, lat: number) => {
  const material = new THREE.MeshBasicMaterial({
    color: 0x22ffcc,
    map: texture,
    transparent: true, //使用背景透明的png贴图，注意开启透明计算
    opacity: 1.0,
    depthWrite: false //禁止写入深度缓冲区数据
  })
  const mesh = new THREE.Mesh(geometry, material) as any
  // 经纬度转球面坐标
  const coord = useLon2xyz(R * 1.002, lon, lat)
  const size = R * 0.16 // 矩形平面Mesh的尺寸
  mesh.size = size // 自定义一个属性，表示mesh静态大小
  mesh.scale.set(size, size, size) // 设置mesh大小
  mesh._s = Math.random() * 1.0 + 1.0 // 自定义属性._s表示mesh在原始大小基础上放大倍数  光圈在原来mesh.size基础上1~2倍之间变化
  //设置mesh位置
  mesh.position.set(coord.x, coord.y, coord.z)
  // mesh姿态设置
  // mesh在球面上的法线方向(球心和球面坐标构成的方向向量)
  var coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize()
  // mesh默认在XOY平面上，法线方向沿着z轴new THREE.Vector3(0, 0, 1)
  var meshNormal = new THREE.Vector3(0, 0, 1)
  // 四元数属性.quaternion表示mesh的角度状态
  //.setFromUnitVectors();计算两个向量之间构成的四元数值
  mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3)

  return mesh
}
export { useWaveMesh }
