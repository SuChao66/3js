import gsap from 'gsap'
import * as THREE from 'three'
// 导入hook
import { useTexture } from '@/hooks'
// 导入shader
import vertexShader from '../shader/vertex.glsl'
import fragmentShader from '../shader/fragment.glsl'

let fighterPointsGroup: THREE.Group // 粒子特效group

// 事件处理
export const useEvent = ({
  floor1,
  floor2,
  wall,
  fighter,
  labels,
  model
}: {
  floor1: any
  floor2: any
  wall: any
  fighter: any
  labels: any[]
  model: any
}) => {
  // 显示第一层楼
  const showFloor1 = () => {
    floor1.visible = true
  }

  // 隐藏第一层楼
  const hideFloor1 = () => {
    floor1.visible = false
  }

  // 显示第二层楼
  const showFloor2 = () => {
    floor2.visible = true
    fighter.visible = true
    showLabel()
  }

  // 隐藏第二层楼
  const hideFloor2 = () => {
    floor2.visible = false
    fighter.visible = false
    hiddenLabel()
  }

  // 显示外墙
  const showWall = () => {
    wall.visible = true
  }

  // 隐藏外墙
  const hideWall = () => {
    wall.visible = false
  }

  // 显示标签
  const showLabel = () => {
    labels.forEach((label) => {
      label.visible = true
    })
  }

  // 隐藏标签
  const hiddenLabel = () => {
    labels.forEach((label) => {
      label.visible = false
    })
  }

  // 创建粒子特效
  const createPoints = () => {
    const group = new THREE.Group()
    // 加载纹理
    const texture = useTexture({
      path: './textures/particles/1.png'
    })

    // 修改点的位置
    const transformPoints = (object3d: any, newObject3d: any) => {
      if (object3d.children.length > 0) {
        object3d.children.forEach((child: any) => {
          if (child.isMesh) {
            // 随机生成颜色
            const color = new THREE.Color(
              Math.random(),
              Math.random(),
              Math.random()
            )
            // 创建粒子材质
            const material = new THREE.ShaderMaterial({
              vertexShader: vertexShader,
              fragmentShader: fragmentShader,
              transparent: true,
              blending: THREE.AdditiveBlending,
              depthTest: false,
              uniforms: {
                uTexture: {
                  value: texture
                },
                uColor: {
                  value: color
                },
                uTime: {
                  value: 0
                }
              }
            })
            const points = new THREE.Points(child.geometry, material)
            points.position.copy(child.position)
            points.rotation.copy(child.rotation)
            points.scale.copy(child.scale)
            newObject3d.add(points)

            transformPoints(child, points)
          }
        })
      }
    }

    transformPoints(fighter, group)
    // 修改位置
    group.position.set(4, 40, 68)
    // 隐藏fighter
    fighter.visible = false

    return group
  }

  // 粒子爆炸
  const pointsBlast = () => {
    if (!fighterPointsGroup) return
    fighterPointsGroup.traverse((child: any) => {
      if (child.isPoints) {
        // 创建随机位置数组
        const randomPositionArray = new Float32Array(
          child.geometry.attributes.position.count * 3
        )
        // 随机创建点位置
        for (let i = 0; i < child.geometry.attributes.position.count; i++) {
          randomPositionArray[i * 3 + 0] = (Math.random() * 2 - 1) * 10 + 4
          randomPositionArray[i * 3 + 1] = (Math.random() * 2 - 1) * 10 + 40
          randomPositionArray[i * 3 + 2] = (Math.random() * 2 - 1) * 10 + 68
        }
        child.geometry.setAttribute(
          'aPosition',
          new THREE.BufferAttribute(randomPositionArray, 3)
        )
        // 修改时间
        gsap.to(child.material.uniforms.uTime, {
          value: 5,
          duration: 5
        })
      }
    })
  }

  // 粒子复原
  const pointsBack = () => {
    if (!fighterPointsGroup) return
    fighterPointsGroup.traverse((child: any) => {
      if (child.isPoints) {
        gsap.to(child.material.uniforms.uTime, {
          value: 0,
          duration: 5
        })
      }
    })
  }

  // 初始化事件
  const initEvent = () => {
    // 厂房外形展示
    const handleShowWall = () => {
      hideFloor1()
      hideFloor2()
      showWall()
    }

    // 厂房分层展开
    const handleShowAll = () => {
      showFloor1()
      showFloor2()
      showWall()
      gsap.to(wall.position, {
        y: 150,
        duration: 1
      })
      gsap.to(floor2.position, {
        y: 50,
        duration: 1,
        delay: 1
      })
    }

    // 关闭厂房分层展开
    const handleHideAll = () => {
      showFloor1()
      showFloor2()
      showWall()
      gsap.to(floor1.position, {
        y: 0,
        duration: 1
      })
      gsap.to(floor2.position, {
        y: 0,
        duration: 1,
        delay: 1
      })
      gsap.to(wall.position, {
        y: 0,
        duration: 1,
        delay: 2,
        onComplete: () => {
          hiddenLabel()
        }
      })
    }

    // 展示第一层楼
    const handleShowFloor1 = () => {
      showFloor1()
      hideFloor2()
      hideWall()
      gsap.to(floor1.position, {
        y: 50,
        duration: 1
      })
    }

    // 展示第二层楼
    const handleShowFloor2 = () => {
      showFloor2()
      hideFloor1()
      hideWall()
      gsap.to(floor2.position, {
        y: 50,
        duration: 1
      })
    }

    // 展开飞机
    const handleFlatFighter = () => {
      hideWall()
      hideFloor1()
      showFloor2()
      // 将飞机展开成立方体
      const positions: THREE.Vector3[] = []
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          positions.push(new THREE.Vector3(i * 2 - 2, j * 2 - 2, 0))
        }
      }
      let n = 0
      fighter.traverse((child: any) => {
        if (child.isMesh) {
          positions[n].multiplyScalar(10)
          gsap.to(child.position, {
            x: '+=' + positions[n].x,
            y: '+=' + positions[n].y,
            z: '+=' + positions[n].z,
            duration: 1
          })
          n++
        }
      })
    }

    // 恢复飞机
    const handleRecoverFighter = () => {
      model.remove(fighterPointsGroup)
      hideWall()
      hideFloor1()
      showFloor2()
      fighter.traverse((child: any) => {
        if (child.isMesh) {
          gsap.to(child.position, {
            x: child.position2.x,
            y: child.position2.y,
            z: child.position2.z,
            duration: 1
          })
        }
      })
    }

    // 粒子特效
    const handlePointsFighter = () => {
      gsap.to(wall.position, {
        y: 150,
        duration: 1,
        onComplete: () => {
          hideWall()
        }
      })
      gsap.to(floor1.position, {
        y: -50,
        duration: 1,
        onComplete: () => {
          hideFloor1()
        }
      })
      showFloor2()
      setTimeout(() => {
        if (!fighterPointsGroup) {
          fighterPointsGroup = createPoints()
          model.add(fighterPointsGroup)
        }
      }, 2500)
    }

    // 粒子爆炸
    const handlePointsBlast = () => {
      // 隐藏fighter
      fighter.visible = false
      pointsBlast()
    }

    // 粒子复原
    const handlePointsBack = () => {
      // 隐藏fighter
      fighter.visible = false
      pointsBack()
    }

    return {
      handleShowWall,
      handleShowAll,
      handleHideAll,
      handleShowFloor1,
      handleShowFloor2,
      handleFlatFighter,
      handleRecoverFighter,
      handlePointsFighter,
      handlePointsBlast,
      handlePointsBack
    }
  }

  return {
    initEvent
  }
}
