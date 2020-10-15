/* eslint-disable import/no-extraneous-dependencies */
const { remote } = require('electron');
const menu = require('./menu');

const eWin = remote.getCurrentWindow();
document.addEventListener('pointerover', (event) => {
  if (event.target === document.documentElement) {
    eWin.setIgnoreMouseEvents(true, { forward: true });
  } else {
    eWin.setIgnoreMouseEvents(false);
  }
});
