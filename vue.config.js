const { defineConfig } = require('@vue/cli-service')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'
const UnoCSS = require('@unocss/webpack').default
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭eslint校验
  lintOnSave: false,
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico',
    },
  },
  configureWebpack: (config) => {
    if (isProd) {
      config.plugins.push(
        new FileManagerPlugin({
          events: {
            onEnd: {
              mkdir: ['./epb_h5'],
              archive: [
                {
                  source: './dist',
                  destination: './epb_h5/dist.tar',
                },
              ],
            },
          },
        }),
      )
    }
    config.plugins.push(UnoCSS({}))
  },
  outputDir: 'dist/dist', // 保证.tar包中多一层dist目录
  chainWebpack: (config) => {
    config.module.rule('vue').uses.delete('cache-loader')
    config.module.rule('tsx').uses.delete('cache-loader')
    config.merge({
      cache: false,
    })
  },
  css: {
    extract:
      process.env.NODE_ENV === 'development'
        ? {
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].css',
          }
        : true,
  },
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://8.130.92.0:7005/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
})
