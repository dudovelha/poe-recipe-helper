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

class StashAPI {
  static async getStashTabs() {
    let response; let stashTabs;
    try {
      response = await axios.get(config.STASH_API_URL, getRequestConfig());
      stashTabs = response.data.tabs;
    } catch (err) {
      stashTabs = null;
    }
    return stashTabs;
  }

  static async getStashTab(tab) {
    let response; let stashTab;
    try {
      response = await axios.get(config.STASH_API_URL, getRequestConfig(tab));
      stashTab = response.data;
      delete (stashTab.tabs);
      delete (stashTab.numTabs);
    } catch (err) {
      stashTab = null;
    }
    return stashTab;
  }
}

module.exports = StashAPI;
