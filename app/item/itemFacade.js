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
  static async addItemTypeToItem(item) {
    const newItem = item;
    const itemType = await itemDB.getItemType({ baseType: item.typeLine });
    if (itemType) {
      newItem.itemType = itemType.itemType;
    }
    return newItem;
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

  static async getItemsFromStashes(stashes) {
    return Promise.all(stashes.map(this.getItemsFromStash));
  }

  static async updateItems() {
    const stashes = await stashFacade.getStashes();
    const itemsArray = await this.getItemsFromStashes(stashes);
    const items = itemsArray.reduce((list, itemList) => list.concat(itemList), []);
    const itemsWithType = await Promise.all(items.map(this.addItemTypeToItem));
    return Promise.all(itemsWithType.map(this.insertOrUpdateItem));
  }

  static async updateItemTypes(forceUpdate) {
    const hasItemTypes = await itemDB.countItemTypes() > 0;
    if (!hasItemTypes || forceUpdate) {
      const itemTypes = await itemAPI.getItemTypes();
      if (itemTypes) {
        const nonDuplicatedItemTypes = removeDuplicates(itemTypes);
        await Promise.all(nonDuplicatedItemTypes.map(this.insertOrUpdateItemType));
      }
    }
  }

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
}

module.exports = ItemFacade;
