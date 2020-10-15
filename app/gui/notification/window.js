/* eslint-disable import/no-extraneous-dependencies */
const { BrowserWindow } = require('electron');
const { logger } = require('../../config/manager');

const INITIAL_X = 16;
const INITIAL_Y = 161;
const SQUARE_SIZE = { w: 52.5, h: 52.5 };
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
    if (!win) win = await createWindow();
    return win;
  }

  static async highlight(position, size, scale, price, recipe) {
    if (!win) await this.getWindow();
    const squareSize = {
      w: SQUARE_SIZE.w * scale,
      h: SQUARE_SIZE.h * scale,
    };

    logger.info(`highlighting position ${JSON.stringify(position)} size ${JSON.stringify(size)} price ${!!price} recipe ${!!recipe}`);
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
