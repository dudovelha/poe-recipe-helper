const { logger } = require('../config/manager');
const stashAPI = require('./stashAPI');
const StashDB = require('./stashDB');
const stashDB = require('./stashDB');

class StashFacade {
  static async getStashes() {
    let stashes = await stashDB.getStashTabs();
    if (stashes.length === 0) {
      logger.warn('stashes not loaded');
      await this.updateStashTabs();
      stashes = await StashDB.getStashTabs();
    }
    return stashes;
  }

  static async getStash(stashProps) {
    let stash = await stashDB.getStashTab(stashProps);
    if (!stash) {
      logger.warn(`could not find stash in db: ${JSON.stringify(stashProps)}`);
      await this.updateStashTabs();
      stash = await stashDB.getStashTab(stashProps);
    }
    return stash;
  }

  static async insertOrUpdateStahTab(stash) {
    const stashInDb = await stashDB.getStashTab({ id: stash.id });
    if (stashInDb) {
      logger.info(`updating stash ${stash.n}`);
      await stashDB.updateStashTab(stash);
    } else {
      logger.info(`inserting stash ${stash.n}`);
      stashDB.insertStashTab(stash);
    }
  }

  static async updateStashTabs(forceUpdate) {
    const hasStashTabs = await stashDB.countStashTabs() > 0;
    if (!hasStashTabs || forceUpdate) {
      const stashes = await stashAPI.getStashTabs();
      if (stashes) {
        await Promise.all(stashes.map(this.insertOrUpdateStahTab));
      }
    }
  }
}

module.exports = StashFacade;
