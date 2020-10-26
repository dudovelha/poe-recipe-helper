const { logger } = require('../config/manager');
const ItemDB = require('./itemDB');
const ItemAPI = require('./itemAPI');
const StashFacade = require('../stash/stashFacade');

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
    const itemInDb = await ItemDB.getItem({ id: item.id });
    if (itemInDb) {
      logger.info(`updating item ${item.name} ${item.typeLine}`);
      await ItemDB.updateItem(item);
    } else {
      logger.info(`inserting item ${item.name} ${item.typeLine}`);
      ItemDB.insertItem(item);
    }
  }

  static async insertOrUpdateItemType(itemType) {
    const itemTypeInDb = await ItemDB.getItemType({ id: itemType.name });
    if (itemTypeInDb) {
      logger.info(`updating itemType ${itemType.name}`);
      await ItemDB.updateItemType(itemType);
    } else {
      logger.info(`inserting itemType ${itemType.name}`);
      ItemDB.insertItemType(itemType);
    }
  }

  static async addItemTypeToItem(item) {
    const newItem = item;
    const itemType = await ItemDB.getItemType({ baseType: item.typeLine });
    if (itemType) {
      newItem.itemType = itemType.itemType;
    }
    return newItem;
  }

  static async getUpdatedItemsFromStash(stash) {
    const items = await ItemAPI.getItemsFromTab(stash.i);
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
    if (forceUpdate) await ItemDB.clearItemDB();
    const hasItems = await ItemDB.countItems() > 0;
    if (!hasItems) {
      const stashes = await StashFacade.getStashes();
      const itemsArray = await this.getUpdatedItemsFromStashes(stashes);
      const items = itemsArray.reduce((list, itemList) => list.concat(itemList), []);
      await Promise.all(items.map(this.insertOrUpdateItem.bind(this)));
    }
  }

  static async updateItemTypes(forceUpdate) {
    const hasItemTypes = await ItemDB.countItemTypes() > 0;
    if (!hasItemTypes || forceUpdate) {
      const itemTypes = await ItemAPI.getItemTypes();
      if (itemTypes) {
        const nonDuplicatedItemTypes = removeDuplicates(itemTypes);
        await Promise.all(nonDuplicatedItemTypes.map(this.insertOrUpdateItemType.bind(this)));
      }
    }
  }

  static async getItemsFromStash(stash) {
    return ItemDB.getItems({ stashId: stash.id });
  }
}

module.exports = ItemFacade;
