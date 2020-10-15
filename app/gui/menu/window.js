/* eslint-disable import/no-extraneous-dependencies */
const { BrowserWindow } = require('electron');

let win;

async function createWindow() {
  const newWin = new BrowserWindow({
    fullscreen: true,
    frame: false,
    transparent: true,
    icon: false,
    skipTaskbar: true,
    focusable: false,
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
  newWin.setIgnoreMouseEvents(true, { forward: true });
  newWin.setAlwaysOnTop(true, 'screen');
  newWin.setPosition(0, 0);
  newWin.loadFile(`${__dirname}/html/index.html`);
  newWin.show();

  // newWin.webContents.openDevTools();
  return promise;
}

class MenuWindow {
  static async getWindow() {
    if (!win) win = await createWindow();
    return win;
  }
}
module.exports = MenuWindow;
