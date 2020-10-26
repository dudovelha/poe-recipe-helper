/* eslint-disable import/no-extraneous-dependencies */
const { BrowserWindow, screen, ipcMain } = require('electron');
const configManager = require('../../config/manager');

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 500;
let win; let creatingWindow;

function updateConfigMessage(event, args) {
  configManager.updateConfig(args);
}

function resetConfigMessage(event, args) {
  configManager.resetConfig();
  win.reload();
}

function closeWindowMessage() {
  win.close();
}

async function createWindow() {
  const newWin = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    frame: false,
    transparent: true,
    icon: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  const promise = new Promise((resolve, reject) => {
    newWin.webContents.on('did-finish-load', () => {
      resolve(newWin);
    });
  });

  const displaySize = screen.getPrimaryDisplay().size;
  newWin.setPosition(displaySize.width - WINDOW_WIDTH, displaySize.height - WINDOW_HEIGHT);
  // newWin.webContents.openDevTools();
  newWin.setAlwaysOnTop(true, 'screen');
  newWin.loadFile(`${__dirname}/html/index.html`);
  newWin.show();
  ipcMain.on('update-config', updateConfigMessage);
  ipcMain.on('reset-config', resetConfigMessage);
  ipcMain.on('close', closeWindowMessage);
  return promise;
}

class ConfigWindow {
  static async getWindow() {
    if (!creatingWindow) {
      creatingWindow = true;
      win = await createWindow();
    } else if (!win) {
      await new Promise((resolve, reject) => {
        setTimeout(() => { this.getWindow().then(resolve).catch(reject); }, 250);
      });
    }
    return win;
  }
}

module.exports = ConfigWindow;
