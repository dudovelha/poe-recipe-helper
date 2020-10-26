const Datastore = require('nedb');
const { logger } = require('../config/manager');
const itemAdapter = require('./itemAdapter');

const handleError = (err) => { if (err) logger.error(err.toString()); };
const db = {};
db.item = new Datastore({ filename: `${__dirname}/item.db`, autoload: true });
db.itemType = new Datastore({ filename: `${__dirname}/itemType.db`, autoload: true });

db.item.ensureIndex({ fieldName: 'id', unique: true, sparse: true }, handleError);
db.itemType.ensureIndex({ fieldName: 'id', unique: true, sparse: true }, handleError);

class ItemDB {
  static updateItem(item) {
    return new Promise((resolse, reject) => {
      const convertedItem = itemAdapter.toItem(item);
      db.item.update({ id: item.id }, convertedItem, {}, (err, numReplaced) => {
        if (err) {
          reject(err);
        } else {
          resolse(numReplaced);
        }
      });
    });
  }

  static updateItemType(itemType) {
    return new Promise((resolse, reject) => {
      const convertedItemType = itemAdapter.toItemType(itemType);
      db.itemType.update({ id: itemType.id }, convertedItemType, {}, (err, numReplaced) => {
        if (err) {
          reject(err);
        } else {
          resolse(numReplaced);
        }
      });
    });
  }

  static insertItem(item) {
    db.item.insert(itemAdapter.toItem(item), handleError);
  }

  static insertItemType(itemType) {
    db.itemType.insert(itemAdapter.toItemType(itemType), handleError);
  }

  static insertItems(items) {
    items.forEach(this.insertStashTab);
  }

  static insertItemTypes(itemTypes) {
    itemTypes.forEach(this.insertStashTab);
  }

  static getItem(itemProps) {
    return new Promise((resolve, reject) => {
      db.item.findOne(itemProps, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  static getItems(itemsProps) {
    const props = itemsProps || {};
    return new Promise((resolve, reject) => {
      db.item.find(props, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  static getItemType(itemTypeProps) {
    return new Promise((resolve, reject) => {
      db.itemType.findOne(itemTypeProps, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  static getItemTypes() {
    return new Promise((resolve, reject) => {
      db.itemType.find({}, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  static countItems() {
    return new Promise((resolve, reject) => {
      db.item.count({}, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  }

  static countItemTypes() {
    return new Promise((resolve, reject) => {
      db.itemType.count({}, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  }

  static clearItemDB() {
    return new Promise((resolve, reject) => {
      db.item.remove({}, { multi: true }, (err, count) => {
        if (err) reject(err);
        resolve(count);
      });
    });
  }

  static clearItemTypeDB() {
    return new Promise((resolve, reject) => {
      db.itemType.remove({}, { multi: true }, (err, count) => {
        if (err) reject(err);
        resolve(count);
      });
    });
  }
}

module.exports = ItemDB;
