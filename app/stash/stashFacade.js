const { logger } = require('../config/manager');
const stashAPI = require('./stashAPI');
const StashDB = require('./stashDB');
const stashDB = require('./stashDB');

class StashFacade {
  static async getStashes() {
    let stashes = await stashDB.getStashTabs();
    if (stashes.length === 0) {
      logger.warn('stashes not loaded');
      this.updateStashTabs();
      stashes = await StashDB.getStashTabs();
    }
    return stashes;
  }

  static async getStash(stashProps) {
    let stash = await stashDB.getStashTab(stashProps);
    if (!stash) {
      logger.warn(`could not find stash: ${JSON.stringify(stashProps)}`);
      this.updateStashTabs();
      stash = await stashDB.getStashTab(stashProps);
    }
    return stash;
  }

  static insertOrUpdateStahTab(stash) {
    return new Promise((resolve, reject) => {
      stashDB.getStashTab({ id: stash.id }).then((stashInDb) => {
        if (stashInDb) {
          logger.info(`updating stash ${stash.n}`);
          stashDB.updateStashTab(stash).then(resolve).catch(reject);
        } else {
          logger.info(`inserting stash ${stash.n}`);
          stashDB.insertStashTab(stash);
          resolve();
        }
      });
    });
  }

  static async updateStashTabs() {
    const stashes = await stashAPI.getStashTabs();
    if (stashes) {
      stashes.forEach(async (stash) => {
        await this.insertOrUpdateStahTab(stash);
      });
    }
  }
}

module.exports = StashFacade;
