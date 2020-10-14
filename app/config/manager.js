const fs = require('fs');
const axios = require('axios');

const logger = require('./configurations/logger');
const fileManager = require('./configurations/files');
const getinstance = require('./configurations/axios');

function removeDuplicates(array) {
  const newArray = [];
  array.forEach((newValue) => {
    if (!newArray.some((value) => value.name === newValue.name)) {
      newArray.push(newValue);
    }
  });
  return newArray;
}

function downloadCurrencyImages() {
  const currencySources = JSON.parse(fs.readFileSync(`${__dirname}/currencySrc.json`));
  const currencyPath = `${__dirname}/../gui/notification/html/currency`;
  if (!fs.existsSync(currencyPath)) fs.mkdirSync(currencyPath);
  const nonDuplicateCurrency = removeDuplicates(currencySources);
  nonDuplicateCurrency.forEach((currency) => {
    const filename = currency.filename || currency.name.toLowerCase();
    const path = `${currencyPath}/${filename}.png`;
    if (!fs.existsSync(path)) {
      axios.get(currency.src, { responseType: 'stream' })
        .then((response) => { response.data.pipe(fs.createWriteStream(path)); })
        .catch(logger.error);
    }
  });
}

class ConfigManager {
  constructor() {
    this.fileManager = fileManager;
    this.logger = logger;
    this.config = fileManager.getConfigurationFile(logger);
    this.axios = {};
    this.axios.poe = getinstance(logger, {
      baseURL: this.config.POE_URL,
      timeout: 1000,
      headers: {
        Cookie: `POESESSID=${this.config.POESESSID}`,
      },
    });
    this.axios.ninja = getinstance(logger, {
      baseURL: this.config.POE_NINJA_URL,
      timeout: 1000,
    });
    downloadCurrencyImages();
  }

  updateConfig(newConfig) {
    this.fileManager.setConfigurationFile(newConfig);
  }

  resetConfig() {
    const newConfig = this.fileManager.getConfigurationFile(logger, true);
    return newConfig;
  }
}

module.exports = new ConfigManager();
