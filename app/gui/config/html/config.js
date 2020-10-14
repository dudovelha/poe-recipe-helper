const fs = require('fs');
const axios = require('axios');

const config = JSON.parse(fs.readFileSync(`${__dirname}/../../../config/config.json`));
const configKeys = Object.keys(config);

function createElement(key) {
  const div = document.createElement('div');
  const label = document.createElement('div');
  const field = key !== 'LEAGUE' ? document.createElement('input') : document.createElement('select');

  div.classList.add('field');
  div.id = key;

  label.textContent = key.toLowerCase().replaceAll('_', ' ');
  label.classList.add('label');

  field.value = config[key];
  field.classList.add('input');

  div.appendChild(label);
  div.appendChild(field);
  document.getElementById('configForm').appendChild(div);
}

class Menu {
  static createElements() {
    configKeys.forEach(createElement);
  }

  static updateLeagues() {
    axios.get('http://api.pathofexile.com/leagues')
      .then((response) => {
        const leagues = response.data;
        const leagueSelector = document.getElementById('LEAGUE').getElementsByClassName('input')[0];
        leagues.forEach((league) => {
          const newOption = document.createElement('option');
          newOption.textContent = league.id;
          newOption.setAttribute('value', league.id);
          leagueSelector.appendChild(newOption);
        });
        leagueSelector.value = config.LEAGUE;
      })
      .catch();
  }

  static getCurrentConfig() {
    const newConfig = {};
    configKeys.forEach((key) => {
      const container = document.getElementById(key);
      const input = container.getElementsByClassName('input')[0];
      newConfig[key] = input.value;
    });
    return newConfig;
  }

  static configureButton(id, callback) {
    const button = document.getElementById(id);
    button.onclick = callback;
  }
}
module.exports = Menu;
