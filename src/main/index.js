'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let aboutToQuit = false

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/`
  : `file://${__dirname}/index.html`

global.winUrl = winURL

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    width: 480,
    minHeight: 600,
    minWidth: 480,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      webSecurity: false,
      devTools: true,
      zoomFactor: 1
    },
    show: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', event => {
    if (aboutToQuit) {
      mainWindow = null
    } else {
      event.preventDefault()
      mainWindow.hide()
    }
  })

  // mainWindow.webContents.openDevTools()
  mainWindow.on('ready-to-show', () => {
    // mainWindow.webContents.openDevTools()
    mainWindow.show()
    mainWindow.focus()
  })

  /*
   * Status composer window
   */
  let statusComposer = new BrowserWindow({
    height: 200,
    width: 340,
    alwaysOnTop: true,
    frame: false,
    resizable: false,
    minimizable: true,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    center: true,
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      webSecurity: false,
      devTools: true,
      zoomFactor: 1
    },
    show: false
  })

  statusComposer.loadURL(winURL + '#composer')

  statusComposer.on('close', event => {
    if (aboutToQuit) {
      statusComposer = null
    } else {
      event.preventDefault()
      statusComposer.hide()
    }
  })

  ipcMain.on('close-status-composer', (event, args) => {
    event.preventDefault()
    statusComposer.hide()
  })

  ipcMain.on('show-status-composer', (event, args) => {
    if (!statusComposer.isVisible()) statusComposer.center()
    statusComposer.webContents.send('show-status-composer', args)
    statusComposer.show()
    statusComposer.focus()
  })
}

app.on('ready', createWindow)

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  } else {
    mainWindow.show()
  }
})

app.on('before-quit', () => {
  aboutToQuit = true
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
