// import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
// import path from 'node:path';

// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     }
//   },
//    server: {
//     host: '0.0.0.0',
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//         secure: false
//       },
//       '/capital': {
//         target: 'https://www.cupidtide.com',
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// })

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path';

export default defineConfig({
  // 核心：打包使用相对路径，解决APP内资源404、白屏
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/capital': {
        target: 'https://www.cupidtide.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // 可选优化：规范打包目录，便于后续复制到 Cordova/www
  build: {
    outDir: 'dist',
    assetsDir: 'static'
  }
})