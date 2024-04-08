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

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [
      vue(),
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
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    base: './'
  }
})
