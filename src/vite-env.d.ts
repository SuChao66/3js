/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}

declare module 'point-in-polygon'

declare module 'delaunator'

declare module '*.glsl' {
  const value: string
  export default value
}
