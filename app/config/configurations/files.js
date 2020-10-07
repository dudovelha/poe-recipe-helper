const fs = require('fs');

const CONFIG_PATH = `${__dirname}\\..\\config.json`;
const CONFIG_SAMPLE_PATH = `${__dirname}\\sample.json`;

function getConfigurationFile(logger) {
  const configSample = fs.readFileSync(CONFIG_SAMPLE_PATH);
  let configFile;

  try {
    configFile = fs.readFileSync(CONFIG_PATH);
    logger.info('configuration file found');
  } catch (err) {
    logger.warn('no config file, creating one');
  }

  if (!configFile) {
    fs.writeFileSync(CONFIG_PATH, configSample);
    configFile = configSample;
  }

  return JSON.parse(configFile);
}

module.exports = getConfigurationFile;
