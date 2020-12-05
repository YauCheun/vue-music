'use strict'


const path = require('path')

module.exports = {
  dev: {

    // 路径
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    // 各种开发服务器设置
    host: 'localhost', //能被process.env.HOST覆盖
    port: 8080, // 可以被process.env覆盖。端口，如果端口正在使用，将确定一个空闲的端口
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // 

    
    /**
     * Source Maps
     */

    devtool: 'cheap-module-eval-source-map',

    // 如果你在调试devtools中的vu -files时遇到问题，
    // 将此设置为false -它可能*有用
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // 模板文件
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    //在构建完成后，运行带有额外参数的构建命令来查看bundle analyzer报告:
    // `npm run build --report`
    //设置为“真”或“假”总是打开或关闭它
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
