'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  Menu,
  MenuItem,
  Tray,
  screen,
  ipcMain,
} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
import initFlash from '@/utils/flashDll'

const isDevelopment = process.env.NODE_ENV !== 'production'


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

Menu.setApplicationMenu(null)
let win = null
let tray = null
let isQuit = false
let screenWidth = 1366
let screenHeight = 768
initFlash(app)
async function createWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize
  screenWidth = parseInt(size.width)
  screenHeight = parseInt(size.height)
  // Create the browser window.
  win = new BrowserWindow({
    width: screenWidth,
    height: screenHeight,
    focus: true,
    frame: false,
    alwaysOnTop: false,
    // resizable: false, // 是否可以改变尺寸
    webPreferences: {
      plugins: true,
      webviewTag: true,
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  // 窗口关闭触发
  // 若isQuit为false, 则不退出, 只是缩小到托盘
  win.on('close', (e) => {
    if (isQuit) {
      win = null
    } else {
      e.preventDefault()
      win.hide()
    }
  })
}

ipcMain.on('windowSizeChange', (e, data) => {
  // win.setResizable(true)
  if (data === 'mini') {
    win.setSize(200, 355)
    win.setPosition(screenWidth - 200, screenHeight - 355, true)
    win.setAlwaysOnTop(true)
  } else {
    win.setSize(screenWidth, screenHeight)
    win.setPosition(0, 0, true)
    win.setAlwaysOnTop(false)
  }
  win.focus()
})

function createTray() {
  // eslint-disable-next-line no-undef
  tray = new Tray(path.resolve(__static, 'logo.png'))
  const contextMenu = Menu.buildFromTemplate([
    new MenuItem({
      label: '显示主程序',
      click: () => {
        if (win.isVisible()) {
          win.focus()
        } else {
          win.show()
        }
      },
    }),
    new MenuItem({
      label: '前置窗口',
      type: 'checkbox',
      checked: true,
      click: (v) => {
        win.setAlwaysOnTop(v.checked)
      },
    }),
    new MenuItem({
      label: '退出程序',
      click: () => {
        isQuit = true
        app.exit()
      },
    }),
  ])
  tray.setToolTip('This is my application')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (win.isVisible()) {
      win.focus()
    } else {
      win.show()
    }
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  await createWindow()
  createTray()
})

// 只允许单个实例
// https://www.electronjs.org/docs/api/app#apprequestsingleinstancelock
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (process.platform === 'win32') {
      if (win) {
        if (win.isMinimized()) {
          win.restore()
        }
        if (win.isVisible()) {
          win.focus()
        } else {
          win.show()
        }
      }
    }
  })
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
