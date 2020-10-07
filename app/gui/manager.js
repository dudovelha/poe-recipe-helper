/* eslint-disable import/no-extraneous-dependencies */
const {
  app, BrowserWindow, globalShortcut, screen,
} = require('electron');
const logger = require('../config/configurations/logger');

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    toolbar: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.setIgnoreMouseEvents(true);

  win.loadFile('index.html');
  let x = 0;
  let y = 0;
  let xDirection = 1;
  let yDirection = 1;
  win.intervalFunc = setInterval(() => {
    win.setPosition(x, y);
    x += (1 * xDirection);
    y += (1 * yDirection);
    if (x >= width || x <= 0) {
      xDirection *= -1;
      logger.info('bounce x');
    }
    if (y >= height || y <= 0) {
      yDirection *= -1;
      logger.info('bounce y');
    }
  }, 10);
  return win;
}

function init() {
  app.whenReady().then(() => {
    const win = createWindow();
    globalShortcut.register('Control+C', () => {
      clearInterval(win.intervalFunc);
      win.close();
      app.exit();
    });
  });
}

module.exports = { init };
