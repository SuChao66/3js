import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import * as THREE from 'three'

export const useUnrealBloomPass = () => {
  const unrealBloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    3.0,
    0.0,
    0.0
  )

  return {
    unrealBloomPass
  }
}
