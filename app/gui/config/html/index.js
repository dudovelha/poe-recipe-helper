/* eslint-disable import/no-extraneous-dependencies */
const { ipcRenderer } = require('electron');
const config = require('./config');

config.createElements();
config.updateLeagues();

config.configureButton('reset', () => {
  ipcRenderer.send('reset-config');
});

config.configureButton('confirm', () => {
  const newConfig = config.getCurrentConfig();
  ipcRenderer.send('update-config', newConfig);
});

config.configureButton('close', () => {
  ipcRenderer.send('close');
});
