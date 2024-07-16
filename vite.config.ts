import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// 导入类型
import type { UserConfig, ConfigEnv, PluginOption } from 'vite'
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
// 插件外部化 CesiumJS
import { viteExternalsPlugin } from 'vite-plugin-externals'
// 自动在index.html引入Cesium.js库文件
import { insertHtml, h } from 'vite-plugin-insert-html'
// 复制插件
import { viteStaticCopy } from 'vite-plugin-static-copy'

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
  // 是否生产环境
  const isProd = mode === 'production'
  const env = loadEnv(mode, '')
  // cesium基础地址
  const cesiumBaseUrl = env['VITE_CESIUM_BASE_URL']
  // 基础路径
  const base = env['VITE_BASE_URL']

  const plugins: PluginOption[] = [
    vue(),
    glsl(),
    cesium(),
    viteExternalsPlugin({
      cesium: 'Cesium' // 外部化 cesium 依赖，之后全局访问形式是 window['Cesium']
    }),
    insertHtml({
      head: [
        // 生产模式使用 CDN 或已部署的 CesiumJS 在线库链接
        // 开发模式用拷贝的库文件，根据 VITE_CESIUM_BASE_URL 自动拼接
        h('script', {
          // 因为涉及前端路径访问，所以开发模式最好显式拼接 base 路径，适配不同 base 路径的情况
          src: isProd
            ? `${base}${cesiumBaseUrl}Cesium.js`
            : `${base}${cesiumBaseUrl}Cesium.js`
        })
      ]
    }),
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

  // 开发/生产模式，复制 node_modules 下的 cesium 依赖
  const cesiumLibraryRoot = 'node_modules/cesium/Build/CesiumUnminified/'
  const cesiumLibraryCopyToRootPath = cesiumBaseUrl // 相对于打包后的路径
  const cesiumStaticSourceCopyOptions = [
    'Assets',
    'ThirdParty',
    'Workers',
    'Widgets'
  ].map((dirName) => {
    return {
      src: `${cesiumLibraryRoot}${dirName}/*`, // 注意后面的 * 字符，文件夹全量复制
      dest: `${cesiumLibraryCopyToRootPath}${dirName}`
    }
  })
  plugins.push(
    viteStaticCopy({
      targets: [
        // 主库文件，开发时选用非压缩版的 IIFE 格式主库文件
        {
          src: `${cesiumLibraryRoot}Cesium.js`,
          dest: cesiumLibraryCopyToRootPath
        },
        // 四大静态文件夹
        ...cesiumStaticSourceCopyOptions
      ]
    })
  )

  return {
    base,
    mode,
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
    plugins
  }
})
