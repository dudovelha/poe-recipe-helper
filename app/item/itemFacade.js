const { logger } = require('../config/manager');
const itemDB = require('./itemDB');
const itemAPI = require('./itemAPI');
const stashFacade = require('../stash/stashFacade');

class ItemFacade {
  static async updateItems() {
    const stashes = await stashFacade.getStashes();
    const itemsArray = await this.getItemsFromStashes(stashes);
    const items = itemsArray.reduce((list, itemList) => list.concat(itemList), []);
    return Promise.all(items.map(this.insertOrUpdateItem));
  }

  static async getItemsFromStashes(stashes) {
    return Promise.all(stashes.map(this.getItemsFromStash));
  }

  static async getItemsFromStash(stash) {
    const items = await itemAPI.getItemsFromTab(stash.i);
    const itemsWithStashIds = [];
    items.forEach((item) => {
      itemsWithStashIds.push({
        stashId: stash.id,
        ...item,
      });
    });
    return itemsWithStashIds;
  }

  static insertOrUpdateItem(item) {
    return new Promise((resolve, reject) => {
      itemDB.getItem({ id: item.id }).then((itemInDb) => {
        if (itemInDb) {
          logger.info(`updating item ${item.typeLine}`);
          itemDB.updateItem(item).then(resolve).catch(reject);
        } else {
          logger.info(`inserting item ${item.typeLine}`);
          itemDB.insertItem(item);
          resolve();
        }
      });
    });
  }
}

module.exports = ItemFacade;
