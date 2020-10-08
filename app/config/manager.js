const getConfigurationFile = require('./configurations/files');
const logger = require('./configurations/logger');
const getinstance = require('./configurations/axios');

class ConfigManager {
  constructor() {
    this.logger = logger;
    this.config = getConfigurationFile(logger);
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
  }
}

module.exports = new ConfigManager();
