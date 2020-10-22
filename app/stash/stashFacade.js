const { logger } = require('../config/manager');
const StashAPI = require('./stashAPI');
const StashDB = require('./stashDB');

class StashFacade {
  static async getStashes() {
    let stashes = await StashDB.getStashTabs();
    if (stashes.length === 0) {
      logger.warn('stashes not loaded');
      await this.updateStashTabs();
      stashes = await StashDB.getStashTabs();
    }
    return stashes;
  }

  static async getStash(stashProps) {
    let stash = await StashDB.getStashTab(stashProps);
    if (!stash) {
      logger.warn(`could not find stash in db: ${JSON.stringify(stashProps)}`);
      await this.updateStashTabs();
      stash = await StashDB.getStashTab(stashProps);
    }
    return stash;
  }

  static async insertOrUpdateStahTab(stash) {
    const stashInDb = await StashDB.getStashTab({ id: stash.id });
    if (stashInDb) {
      logger.info(`updating stash ${stash.n}`);
      await StashDB.updateStashTab(stash);
    } else {
      logger.info(`inserting stash ${stash.n}`);
      StashDB.insertStashTab(stash);
    }
  }

  static async updateStashTabs(forceUpdate) {
    const hasStashTabs = await StashDB.countStashTabs() > 0;
    if (!hasStashTabs || forceUpdate) {
      const stashes = await StashAPI.getStashTabs();
      if (stashes) {
        await Promise.all(stashes.map(this.insertOrUpdateStahTab));
      }
    }
  }
}

module.exports = StashFacade;
