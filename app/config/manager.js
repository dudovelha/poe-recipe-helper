const fs = require('fs');

const logger = require('./configurations/logger');
const fileManager = require('./configurations/files');
const getinstance = require('./configurations/axios');

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
    this.currency = JSON.parse(fs.readFileSync(`${__dirname}/currencySrc.json`));
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
