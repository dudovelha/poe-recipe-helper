/* eslint-disable import/no-extraneous-dependencies */
const {
  app, globalShortcut,
} = require('electron');
const notificationWindow = require('./notification/window');
const logger = require('../config/configurations/logger');

function registerShortcuts() {
  globalShortcut.register('Control+C', () => { app.exit(); });
}

class GuiManager {
  static init() {
    return new Promise((resolve, reject) => {
      app.whenReady().then(() => {
        registerShortcuts();
        notificationWindow.create();
        resolve();
      }).catch(reject);
    });
  }

  static highlight(stash, item) {
    const scale = stash.type === 'QuadStash' ? 0.5 : 1;
    notificationWindow.highlight(item.position, item.size, scale, item.price);
  }
}

module.exports = GuiManager;
