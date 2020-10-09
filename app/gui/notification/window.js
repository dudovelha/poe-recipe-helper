/* eslint-disable import/no-extraneous-dependencies */
const { BrowserWindow } = require('electron');

const INITIAL_X = 16;
const INITIAL_Y = 161;
const SQUARE_SIZE = { w: 52.5, h: 52.5 };
let win;

function createWindow() {
  const newWin = new BrowserWindow({
    fullscreen: true,
    frame: false,
    toolbar: false,
    transparent: true,
    icon: false,
    skipTaskbar: true,
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  newWin.setIgnoreMouseEvents(true, { forward: true });
  newWin.setAlwaysOnTop(true, 'screen');
  newWin.setPosition(0, 0);
  newWin.loadFile(`${__dirname}/html/index.html`);
  return newWin;
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
  static create() {
    win = createWindow();
  }

  static close() {
    win.close();
  }

  static highlight(position, size, scale, price) {
    const squareSize = {
      w: SQUARE_SIZE.w * scale,
      h: SQUARE_SIZE.h * scale,
    };

    win.webContents.send('highlight',
      {
        position: getPosition(position, squareSize),
        size: getSize(size, squareSize),
        price,
      });
  }
}

module.exports = NotificationWindow;
