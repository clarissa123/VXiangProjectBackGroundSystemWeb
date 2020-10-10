/*
 * @Author: your name
 * @Date: 2020-05-19 09:49:28
 * @LastEditTime: 2020-08-10 22:07:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \VXiangProjectBackGroundSystemWeb\vue.config.js
 */
module.exports = {
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // 基本路径
  publicPath: "./",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // webpack-dev-server 相关配置
  devServer: {
    port: 80,
    open: true, //自动打开网页
  },
  // webpack配置
  chainWebpack: config => {
    // 删除预加载 移除 prefetch 插件
    config.plugins.delete('prefetch');
    //删除预加载 移除 preload 插件
    config.plugins.delete('preload');
    // 压缩代码
    config.optimization.minimize(true);
    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all'
    });
  }
};