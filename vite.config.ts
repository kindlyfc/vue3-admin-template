import { fileURLToPath } from 'url'
import { resolve } from 'node:path'
import { loadEnv } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import checker from 'vite-plugin-checker'
import { viteMockServe } from 'vite-plugin-mock'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import dayjs from 'dayjs'
import DefineOptions from 'unplugin-vue-define-options/vite'
import pkg from './package.json'
import type { UserConfig, ConfigEnv } from 'vite'
const CWD = process.cwd()
const baseSrc = fileURLToPath(new URL('./src', import.meta.url))

// 如果你使用到了 ant-design-vue 的 less 变量，通过兼容包将 v4 变量转译成 v3 版本，并通过 less-loader 注入：
const { theme } = require('ant-design-vue/lib')
const convertLegacyToken = require('ant-design-vue/lib/theme/convertLegacyToken')
const { defaultAlgorithm, defaultSeed } = theme
const mapToken = defaultAlgorithm(defaultSeed)
const v3Token = convertLegacyToken.default(mapToken)

// 环境变量
// const BASE_ENV_CONFIG = loadEnv('', CWD);
// const DEV_ENV_CONFIG = loadEnv('development', CWD);
// const PROD_ENV_CONFIG = loadEnv('production', CWD);

const __APP_INFO__ = {
  pkg,
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL, VITE_DROP_CONSOLE } = loadEnv(mode, CWD)

  const isBuild = command === 'build'

  return {
    base: VITE_BASE_URL,
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    resolve: {
      alias: [
        {
          find: 'dayjs',
          replacement: 'dayjs/esm',
        },
        {
          find: /^dayjs\/locale/,
          replacement: 'dayjs/esm/locale',
        },
        {
          find: /^dayjs\/plugin/,
          replacement: 'dayjs/esm/plugin',
        },
        {
          find: 'vue-i18n',
          replacement:
            mode === 'development'
              ? 'vue-i18n/dist/vue-i18n.esm-browser.js'
              : 'vue-i18n/dist/vue-i18n.esm-bundler.js',
        },
        {
          find: /^ant-design-vue\/es$/,
          replacement: 'ant-design-vue/es',
        },
        {
          find: /^ant-design-vue\/dist$/,
          replacement: 'ant-design-vue/dist',
        },
        {
          find: /^ant-design-vue\/lib$/,
          replacement: 'ant-design-vue/es',
        },
        {
          find: /^ant-design-vue$/,
          replacement: 'ant-design-vue/es',
        },
        {
          find: 'lodash',
          replacement: 'lodash-es',
        },
        {
          find: '~@',
          replacement: baseSrc,
        },
        {
          find: '~',
          replacement: baseSrc,
        },
        {
          find: '@',
          replacement: baseSrc,
        },
      ],
    },
    plugins: [
      vue(),
      Unocss(),
      DefineOptions(), // https://github.com/sxzz/unplugin-vue-define-options
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),

      legacy({
        targets: ['defaults', 'not IE 11', 'chrome 79', 'maintained node versions'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        // 根据你自己需要导入相应的polyfill:  https://github.com/vitejs/vite/tree/main/packages/plugin-legacy#polyfill-specifiers
        modernPolyfills: ['es.promise.finally', 'es/array', 'es/map', 'es/set'],
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [resolve(CWD, 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'svg-icon-[dir]-[name]',
      }),
      viteMockServe({
        ignore: /^_/,
        mockPath: 'mock',
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        logger: true,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';

          setupProdMockServer();
          `,
      }),
      // https://github.com/antfu/unplugin-vue-components
      //让 unplugin-vue-components 只有在生产环境生效
      // {
      //   ...Components({
      //     resolvers: [AntDesignVueResolver()],
      //   }),
      //   apply: 'build',
      // },
      // 开发环境动态加入ui库框架引入
      {
        name: 'dev-auto-import-antdv',
        transform(code, id) {
          if (/src\/main.ts$/.test(id)) {
            const result = code.split('\n')
            const script = `
              import * as components from 'ant-design-vue/es/components';
              const filters = ['AButton'];
              Object.entries(components).forEach(([key, comp]) => {
                if (comp.install && !filters.includes(comp.name)) {
                  app.use(comp);
                }
              });
            `
            // 解决首次加载isCustomElement的问题
            result.splice(result.length - 2, 0, script)
            return {
              code: result.join('\n'),
              map: null,
            }
          }
        },
        apply: 'serve',
      },
      // https://github.com/fi3ework/vite-plugin-checker
      checker({
        typescript: true,
        // vueTsc: true,
        // eslint: {
        //   lintCommand: 'eslint "./src/**/*.{.vue,ts,tsx}"', // for example, lint .ts & .tsx
        // },
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
          additionalData: `
            @import "@/styles/variables.less";
          `,
        },
        loader: 'less-loader',
        options: {
          lessOptions: {
            modifyVars: v3Token,
          },
        },
        // scss: router{
        //   additionalData: `
        //   @use 'sass:math';
        //   @import "src/styles/global.scss";
        //   `,
        // },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 8088,
      proxy: {
        '/api': {
          target: 'http://172.18.1.243:58088', //测试环境
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, av ''),
        },
        '/bucket': {
          target: 'http://172.18.1.243:59001', // 测试环境
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/bucket/, ''),
          // configure: (proxy: any, options: ServerOptions) => {
          //   proxy.on('proxyReq', (proxyReq: any, req: any, res: any) => {
          //     const targetUrl = `${options.target}${req.url?.replace(/^\/bucket/, '')}`
          //     console.log(`Proxying request to: ${targetUrl}`)
          //   })

          //   proxy.on('error', (err: Error, req: any, res: any) => {
          //     console.error(`Proxy error at ${req.url}: ${err.message}`)
          //     res.writeHead(500, {
          //       'Content-Type': 'text/plain',
          //     })
          //     res.end('Proxy error. Please try again later.')
          //   })
          // },
        },
        // '/ws-api': {
        //   target: 'wss://nest-api.buqiyuan.site',
        //   // target: 'http://localhost:7002',
        //   changeOrigin: true, //是否允许跨域
        //   ws: true,
        // },
      },
    },
    optimizeDeps: {
      include: [
        '@vue/runtime-core',
        'lodash-es',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
      supported: {
        // https://github.com/vitejs/vite/pull/8665
        'top-level-await': true,
      },
    },
    build: {
      target: 'es2017',
      minify: 'esbuild',
      cssTarget: 'chrome79',
      chunkSizeWarningLimit: 4096,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
            antd: ['ant-design-vue', '@ant-design/icons-vue', 'dayjs'],
            // lodash: ['loadsh-es'],
          },
        },
      },
    },
  }
}
