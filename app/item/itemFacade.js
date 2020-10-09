const { logger } = require('../config/manager');
const itemDB = require('./itemDB');
const itemAPI = require('./itemAPI');
const stashFacade = require('../stash/stashFacade');

function removeDuplicates(array) {
  const newArray = [];
  array.forEach((newValue) => {
    if (!newArray.some((value) => value.name === newValue.name)) {
      newArray.push(newValue);
    }
  });
  return newArray;
}

class ItemFacade {
  static async insertOrUpdateItem(item) {
    const itemInDb = await itemDB.getItem({ id: item.id });
    if (itemInDb) {
      logger.info(`updating item ${item.name} ${item.typeLine}`);
      await itemDB.updateItem(item);
    } else {
      logger.info(`inserting item ${item.name} ${item.typeLine}`);
      itemDB.insertItem(item);
    }
  }

  static async insertOrUpdateItemType(itemType) {
    const itemTypeInDb = await itemDB.getItemType({ id: itemType.name });
    if (itemTypeInDb) {
      logger.info(`updating itemType ${itemType.name}`);
      await itemDB.updateItemType(itemType);
    } else {
      logger.info(`inserting itemType ${itemType.name}`);
      itemDB.insertItemType(itemType);
    }
  }

  static async addItemTypeToItem(item) {
    const newItem = item;
    const itemType = await itemDB.getItemType({ baseType: item.typeLine });
    if (itemType) {
      newItem.itemType = itemType.itemType;
    }
    return newItem;
  }

  static async getUpdatedItemsFromStash(stash) {
    const items = await itemAPI.getItemsFromTab(stash.i);
    const itemsWithStashIds = [];
    items.forEach((item) => {
      itemsWithStashIds.push({
        stashId: stash.id,
        ...item,
      });
    });
    return Promise.all(itemsWithStashIds.map(this.addItemTypeToItem.bind(this)));
  }

  static async getUpdatedItemsFromStashes(stashes) {
    return Promise.all(stashes.map(this.getUpdatedItemsFromStash.bind(this)));
  }

  static async updateItems(forceUpdate) {
    const hasItems = await itemDB.countItems() > 0;
    if (!hasItems || forceUpdate) {
      const stashes = await stashFacade.getStashes();
      const itemsArray = await this.getUpdatedItemsFromStashes(stashes);
      const items = itemsArray.reduce((list, itemList) => list.concat(itemList), []);
      await Promise.all(items.map(this.insertOrUpdateItem.bind(this)));
    }
  }

  static async updateItemTypes(forceUpdate) {
    const hasItemTypes = await itemDB.countItemTypes() > 0;
    if (!hasItemTypes || forceUpdate) {
      const itemTypes = await itemAPI.getItemTypes();
      if (itemTypes) {
        const nonDuplicatedItemTypes = removeDuplicates(itemTypes);
        await Promise.all(nonDuplicatedItemTypes.map(this.insertOrUpdateItemType.bind(this)));
      }
    }
  }

  static async getItemsFromStash(stash) {
    return itemDB.getItems({ stashId: stash.id });
  }
}

module.exports = ItemFacade;
