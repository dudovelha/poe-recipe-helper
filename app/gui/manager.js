/* eslint-disable import/no-extraneous-dependencies */
const { app, globalShortcut } = require('electron');
const notificationWindow = require('./notification/window');
const menuWindow = require('./menu/window');
const configWindow = require('./config/window');
const logger = require('../config/configurations/logger');
const { create } = require('./notification/window');

function registerShortcuts() {
  globalShortcut.register('Control+Alt+C', () => { app.exit(); });
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
}

module.exports = GuiManager;
