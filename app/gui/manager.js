/* eslint-disable import/no-extraneous-dependencies */
const { app, globalShortcut, BrowserWindow } = require('electron');
const { waitFor } = require('../utils');
const path = require('path');
const url = require('url');

const windows = {};

const startUrl = process.env.ELECTRON_START_URL || url.format({
  pathname: path.join(__dirname, '/../build/index.html#'),
  protocol: 'file:',
  slashes: true
});

function registerShortcuts() {
  globalShortcut.register('Control+Alt+C', () => { app.exit(); });
}

async function createWindow(route) {
  const newWin = new BrowserWindow({
    //fullscreen: true,
    //frame: false,
    transparent: true,
    icon: false,
    skipTaskbar: true,
    //focusable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  //newWin.setIgnoreMouseEvents(true, { forward: true });
  //newWin.setAlwaysOnTop(true, 'screen');
  newWin.setPosition(0, 0);
  newWin.loadURL(startUrl + '/' + route);

  // newWin.webContents.openDevTools();

  const promise = new Promise((resolve, reject) => {
    newWin.webContents.on('did-finish-load', () => {      
      resolve(newWin);
      newWin.show();
    });
  });

  return promise;
}

class GuiManager {
  static init() {
    return new Promise((resolve, reject) => {

      app.on('window-all-closed', (e) => e.preventDefault());

      app.whenReady().then(() => {
        registerShortcuts();
        resolve();
      }).catch(reject);

    });
  }

  static async getWindow(name, route) {
    if (!windows[name]) {
      windows[name] = true;
      windows[name] = await createWindow(route);

    } else if (!(windows[name] instanceof BrowserWindow)) {
      await waitFor(() => windows[name] instanceof BrowserWindow, 500);
    }
    return windows[name];
  }

  /*
  static async highlight(stash, item) {
    const scale = stash.type === 'QuadStash' ? 0.5 : 1;
    logger.info(`highlighting ${item.baseType} on position ${JSON.stringify(item.position)} size ${JSON.stringify(item.size)} price ${!!item.price} recipe ${!!item.recipe}`);
    await notificationWindow.highlight(
      item.position,
      item.size,
      scale,
      item.price,
    );
  }

  static async configure() {
    await configWindow.getWindow();
  }
  */
}

module.exports = GuiManager;
