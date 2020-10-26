/* eslint-disable import/no-extraneous-dependencies */
const { BrowserWindow } = require('electron');
const { logger } = require('../../config/manager');

const INITIAL_X = 16;
const INITIAL_Y = 161;
const SQUARE_SIZE = { w: 52.5, h: 52.5 };
let win; let creatingWindow;

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
      logger.info('highlight window created');
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

function getPosition(pos, squareSize) {
  return {
    x: (INITIAL_X + (squareSize.w * pos.x)),
    y: (INITIAL_Y + (squareSize.h * pos.y)),
  };
}

function getSize(size, squareSize) {
  return {
    w: (squareSize.w * size.w),
    h: (squareSize.h * size.h),
  };
}

class NotificationWindow {
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

  static async highlight(position, size, scale, price, recipe) {
    if (!win) await this.getWindow();
    const squareSize = {
      w: SQUARE_SIZE.w * scale,
      h: SQUARE_SIZE.h * scale,
    };

    win.webContents.send('highlight',
      {
        position: getPosition(position, squareSize),
        size: getSize(size, squareSize),
        price,
        recipe,
      });
  }
}

module.exports = NotificationWindow;
