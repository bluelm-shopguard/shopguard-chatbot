/**
 * QuickApp 项目配置
 */
module.exports = {
  /**
   * 构建配置
   */
  build: {
    /**
     * 构建过程中是否显示进度条
     * @type {boolean}
     */
    enableProgress: true,

    /**
     * 构建配置生成处理配置
     * @type {Object}
     */
    buildConfigInjector: {
      /**
       * 是否压缩rpk包
       * @type {boolean}
       */
      compressRpk: true,

      /**
       * 是否混淆 JS 代码
       * @type {boolean}
       */
      enableUglify: true,

      /**
       * rpk包资源的输出路径
       * @type {string}
       */
      outputPath: 'build',

      /**
       * 允许把模块名替换为字母，减小 rpk 包的大小
       * 在小游戏中不要使用
       * @type {boolean}
       */
      enableModuleNameResolver: true,

      /**
       * 是否使用短路径
       * @type {boolean}
       */
      optimizeDescFile: true
    }
  }
}
