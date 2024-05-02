import * as THREE from 'three'

/**
 * 创建屋顶
 * @param scene
 */
export const useRoof = (scene: THREE.Scene) => {
  const sphereGroup = new THREE.Group()
  const R = 700
  // 1.创建一个圆柱体表示隧道
  const geometry = new THREE.CylinderGeometry(
    R * 1.21,
    R * 1.21,
    R * 9,
    32,
    1,
    true,
    0,
    Math.PI
  )
  // 2.创建材质
  const material = new THREE.MeshLambertMaterial({
    color: 0x222222,
    transparent: true,
    side: THREE.DoubleSide // 设置背面可见，相机和车都在隧道内
  })
  // 3.创建隧道模型
  const mesh = new THREE.Mesh(geometry, material)
  sphereGroup.add(mesh)
  sphereGroup.rotateZ(Math.PI / 2)
  scene.add(sphereGroup)

  // 4.隧道圆柱上设置一些装饰圆点
  const sphereGeo = new THREE.CylinderGeometry(R, R, R * 8, 32, 50, true)
  const pos = sphereGeo.attributes.position
  const cirGeo = new THREE.CircleGeometry(8, 15, 15)
  for (let i = 0; i < pos.count; i++) {
    const cirMaterial = new THREE.MeshLambertMaterial({
      color: 0xaaaa66,
      side: THREE.BackSide
    })
    cirMaterial.color.r = Math.random() * 0.7 + 0.3
    cirMaterial.color.g = cirMaterial.color.r
    cirMaterial.color.b = cirMaterial.color.r
    // 获取顶点的坐标
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)
    // 垂直屏幕的方向  z轴方向
    const V1 = new THREE.Vector3(0, 0, 1)
    // 圆柱y设置为0
    const V2 = new THREE.Vector3(x, 0, z).normalize()
    // 创建四元数
    const q = new THREE.Quaternion()
    // 将该四元数设置为从方向向量 vFrom 旋转到方向向量 vTo 所需的旋转。
    q.setFromUnitVectors(V1, V2)
    // 创建一个四阶矩阵
    const M = new THREE.Matrix4()
    // 将这个矩阵的旋转分量设置为四元数q指定的旋转，
    M.makeRotationFromQuaternion(q)
    // 创建网格模型
    const planeMesh = new THREE.Mesh(cirGeo, cirMaterial)
    planeMesh.applyMatrix4(M)
    planeMesh.position.set(x, y, z)
    sphereGroup.add(planeMesh)
  }

  sphereGroup.position.y = -10
}
