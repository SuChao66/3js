import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// 导入类型
import type { UserConfig, ConfigEnv } from 'vite'
// 引入配置需要自动导入的组件
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
// 引入自动导入 api
import AutoImport from 'unplugin-auto-import/vite'
// 性能分析：打包体积可视化
import { visualizer } from 'rollup-plugin-visualizer'
// 兼容传统浏览器
import legacy from '@vitejs/plugin-legacy'
// svg插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// glsl插件
import glsl from 'vite-plugin-glsl'
// 导入cesium插件
import cesium from 'vite-plugin-cesium'

const vendorLibs: { match: string[]; output: string }[] = [
  {
    match: ['element-plus'],
    output: 'elementPlus'
  },
  {
    match: ['echarts'],
    output: 'echarts'
  }
]
// 手动拆包
export const configManualChunk = (id: string) => {
  if (/[\\/]node_modules[\\/]/.test(id)) {
    const matchItem = vendorLibs.find((item) => {
      const reg = new RegExp(
        `[\\/]node_modules[\\/]_?(${item.match.join('|')})(.*)`,
        'ig'
      )
      return reg.test(id)
    })
    return matchItem ? matchItem.output : null
  }
}

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  return {
    base: './',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      port: 8080
    },
    build: {
      rollupOptions: {
        output: {
          // manualChunks: configManualChunk
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          }
        }
      },
      chunkSizeWarningLimit: 1024
    },
    plugins: [
      vue(),
      glsl(),
      cesium(),
      AutoImport({
        // 配置需要自动导入的模块
        imports: ['vue', 'vue-router', 'vue-i18n'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/auto-import.d.ts'
      }),
      // 配置需要自动导入的模块
      Components({
        // 导入存放的位置
        dts: 'src/types/components.d.ts',
        resolvers: [ElementPlusResolver()]
      }),
      // 打包可视化
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: './node_modules/.cache/visualizer/stats.html'
      }),
      // 兼容传统浏览器
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ]
  }
})
