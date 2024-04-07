import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
// 导入类型
import type { UserConfig, ConfigEnv } from "vite";

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
  };
});
