const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 12345,
  },
  pluginOptions: {
    electronBuilder: {
      productName: 'testapp',
      nodeIntegration: true,
      fileAssociations: {
        protocols: ['testapp'],
      },
      builderOptions: {
        asar: true,
        win: {
          target: [
            {
              target: 'nsis', // 打包安装包
              arch: ['x64'], // windows 64位
            },
          ],
        },
        nsis: {
          oneClick: false, // 一键安装
          perMachine: true, // 为所有用户安装
          allowElevation: true, // 允许权限提升, 设置 false 的话需要重新允许安装程序
          allowToChangeInstallationDirectory: true, // 允许更改安装目录
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单
          deleteAppDataOnUninstall: true, // 卸载时清除应用数据
          guid: 'DCB00BC1-FE06-3A87-C7F4-5B0C0EA2D148', // 软件guid
        },
        files: ['**/*', '!src/'],
        extraResources: {
          from: 'libs/',
          to: './',
        },
      },
    },
  },
})
