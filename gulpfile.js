const gulp = require('gulp');
const axios = require('axios');
const electronPath = require('electron')
const { spawn } = require('child_process');

function startReactServer(cb) {
  const reactServer = spawn('npm.cmd', ['run', 'react:start'], { stdio: 'inherit' });
  reactServer.on('close', (code) => {
    console.log('closing react server');
    cb();
  });
}

function startElectron(cb) {
  let lock = false;
  const interval = setInterval(() => {
    axios.get('http://localhost:3000')
      .then((response) => {
        if (response.status === 200) {
          clearInterval(interval);
          if (!lock) {
            lock = true;
            const electron = spawn(electronPath, ['-r', 'dotenv/config', './app/main.js'], { stdio: 'inherit' });
            electron.on('close', (code) => {
              console.log('closing electron');
              cb();
            });
          }
        }
      })
      .catch(ignore => { });
  }, 500);

}

exports.start = gulp.parallel(startReactServer, startElectron);