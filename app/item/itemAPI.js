const { config, logger, axios } = require('../config/manager');

function getRequestConfig(tab) {
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

class ItemAPI {
  static async getItemsFromTab(tab) {
    let response; let items;
    try {
      response = await axios.get(config.STASH_API_URL, getRequestConfig(tab));
      items = response.data.items;
    } catch (err) {
      items = null;
    }
    return items;
  }
}

module.exports = ItemAPI;
