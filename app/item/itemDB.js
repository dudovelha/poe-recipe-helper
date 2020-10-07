const Datastore = require('nedb');
const { config, logger } = require('../config/manager');

const handleError = (err) => { if (err) logger.error(err.toString()); };
const db = new Datastore({ filename: `${__dirname}/item.db`, autoload: true });

db.ensureIndex({ fieldName: 'id', unique: true, sparse: true }, handleError);

function convertFrameType(frameType) {
  switch (frameType) {
    case 0:
      return 'normal';
    case 1:
      return 'magic';
    case 2:
      return 'rare';
    case 3:
      return 'unique';
    case 4:
      return 'gem';
    case 5:
      return 'currency';
    case 6:
      return 'divination card';
    case 7:
      return 'quest item';
    case 8:
      return 'prophecy';
    case 9:
      return 'relic';
    default:
      return 'unknown';
  }
}

function convertName(name, typeLine) {
  return [name, typeLine].filter((string) => string).join(' ');
}

function convertItem(item) {
  return {
    size: { w: item.w, h: item.h },
    position: { x: item.x, y: item.y },
    stashId: item.stashId,
    name: convertName(item.name, item.typeLine),
    identified: item.identified,
    ilvl: item.ilvl,
    type: convertFrameType(item.frameType),
    corrupted: item.corrupted,
    id: item.id,
  };
}

class ItemDB {
  static updateItem(item) {
    return new Promise((resolse, reject) => {
      db.update({ id: item.id }, convertItem(item), {}, (err, numReplaced) => {
        if (err) {
          reject(err);
        } else {
          resolse(numReplaced);
        }
      });
    });
  }

  static insertItem(item) {
    db.insert(convertItem(item), handleError);
  }

  static insertItems(items) {
    items.forEach(this.insertStashTab);
  }

  static insertOrUpdateItem(item) {
    return new Promise((resolve, reject) => {
      this.getitem({ id: item.id }).then((itemInDb) => {
        if (itemInDb) {
          logger.info(`updating item ${item.n}`);
          this.updateStashTab(item).then(resolve).catch(reject);
        } else {
          logger.info(`inserting stash ${item.n}`);
          this.insertStashTab(item);
          resolve();
        }
      });
    });
  }

  static getItem(itemProps) {
    return new Promise((resolve, reject) => {
      db.findOne(itemProps, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  static getItems() {
    return new Promise((resolve, reject) => {
      db.find({}, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }
}

module.exports = ItemDB;
