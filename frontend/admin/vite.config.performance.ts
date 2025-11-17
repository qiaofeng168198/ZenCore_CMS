import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import viteImagemin from 'vite-plugin-imagemin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    // Gzip 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 10KB以上才压缩
      algorithm: 'gzip',
      ext: '.gz',
    }),

    // Brotli 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br',
    }),

    // 图片压缩
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),

    // 打包分析
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    // 目标浏览器
    target: 'es2015',

    // 分块策略
    rollupOptions: {
      output: {
        // 手动代码分割
        manualChunks: {
          // Vue核心库
          'vue-vendor': ['vue', 'vue-router', 'pinia'],

          // Element Plus UI库
          'element-plus': ['element-plus', '@element-plus/icons-vue'],

          // 工具库
          'utils': ['axios', 'dayjs'],

          // 编辑器（如果有）
          // 'editor': ['@wangeditor/editor', '@wangeditor/editor-for-vue'],
        },

        // 入口分块命名
        entryFileNames: 'js/[name]-[hash].js',

        // 分块命名
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').slice(-2).join('/') : 'misc'
          return `js/${facadeModuleId}-[hash].js`
        },

        // 资源文件命名
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          let extType = info[info.length - 1]

          if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'images'
          } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'fonts'
          } else if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            extType = 'media'
          }

          return `${extType}/[name]-[hash][extname]`
        },
      },
    },

    // 压缩选项
    minify: 'terser',
    terserOptions: {
      compress: {
        // 删除console
        drop_console: true,
        // 删除debugger
        drop_debugger: true,
        // 删除未使用的代码
        pure_funcs: ['console.log'],
      },
      format: {
        // 删除注释
        comments: false,
      },
    },

    // 分块大小警告限制 (KB)
    chunkSizeWarningLimit: 1000,

    // CSS代码分割
    cssCodeSplit: true,

    // 生成sourcemap
    sourcemap: false,

    // 启用/禁用 CSS 代码拆分
    cssCodeSplit: true,

    // 资源内联限制 (bytes)
    assetsInlineLimit: 4096,

    // 清除输出目录
    emptyOutDir: true,
  },

  // 开发服务器配置
  server: {
    port: 8080,
    host: '0.0.0.0',
    open: false,
    cors: true,

    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  // 预构建优化
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'element-plus',
      '@element-plus/icons-vue',
      'axios',
    ],
    exclude: [],
  },

  // CSS配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`,
      },
    },
    // 启用CSS模块
    modules: {
      localsConvention: 'camelCase',
    },
  },

  // Esbuild配置
  esbuild: {
    // 删除console和debugger
    drop: ['console', 'debugger'],
    // 压缩标识符
    minifyIdentifiers: true,
    // 压缩空白
    minifyWhitespace: true,
    // 压缩语法
    minifySyntax: true,
  },
})
