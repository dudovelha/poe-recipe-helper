const { config, logger, axios } = require('../config/manager');

function getStashRequestConfig(tab) {
  const requestConfig = {
    params: {
      accountName: config.ACCOUNT,
      league: config.LEAGUE,
      realm: 'pc',
      tabs: 1,
    },
  };

  if (Number.isInteger(tab)) {
    requestConfig.params.tabIndex = tab;
  }

  return requestConfig;
}

function getItemTypeRequestConfig() {
  return {
    params: {
      league: config.LEAGUE,
      type: 'BaseType',
      language: 'en',
    },
  };
}

class ItemAPI {
  static async getItemsFromTab(tab) {
    let response; let items;
    try {
      response = await axios.poe.get(config.STASH_API_URL, getStashRequestConfig(tab));
      items = response.data.items;
    } catch (err) {
      items = null;
    }
    return items;
  }

  static async getItemTypes() {
    let response; let itemTypes;
    try {
      response = await axios.ninja.get(config.ITEM_TYPE_URL, getItemTypeRequestConfig());
      itemTypes = response.data.lines;
    } catch (err) {
      logger.log(err);
    }
    return itemTypes;
  }
}

module.exports = ItemAPI;
