const getConfigurationFile = require('./configurations/files');
const logger = require('./configurations/logger');
const getinstance = require('./configurations/axios');

class ConfigManager {
  constructor() {
    this.logger = logger;
    this.config = getConfigurationFile(logger);
    this.axios = getinstance(logger, this.config);
  }
}

module.exports = new ConfigManager();
