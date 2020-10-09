/* eslint-disable import/no-extraneous-dependencies */
const { ipcRenderer } = require('electron');
const highlight = require('./highlight');

ipcRenderer.on('highlight', (event, message) => {
  const div = highlight.getHighlightSquare(message.position, message.size, message.price);
  document.body.appendChild(div);
});
