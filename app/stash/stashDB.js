const Datastore = require('nedb');
const { logger } = require('../config/manager');

const handleError = (err) => { if (err) logger.error(err.toString()); };
const db = new Datastore({ filename: `${__dirname}/stash.db`, autoload: true });

db.ensureIndex({ fieldName: 'id', unique: true, sparse: true }, handleError);

function convertStash(stash) {
  return {
    n: stash.n,
    i: stash.i,
    type: stash.type,
    id: stash.id,
  };
}

class StashDB {
  static updateStashTab(stash) {
    return new Promise((resolse, reject) => {
      db.update({ id: stash.id }, convertStash(stash), {}, (err, numReplaced) => {
        if (err) {
          reject(err);
        } else {
          resolse(numReplaced);
        }
      });
    });
  }

  static insertStashTab(stash) {
    db.insert(convertStash(stash), handleError);
  }

  static insertStashTabs(stashes) {
    stashes.forEach(this.insertStashTab);
  }

  static getStashTab(stashProps) {
    return new Promise((resolve, reject) => {
      db.findOne(stashProps, (err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  }

  static getStashTabs() {
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

  static countStashTabs() {
    return new Promise((resolve, reject) => {
      db.count({}, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  }
}

module.exports = StashDB;
