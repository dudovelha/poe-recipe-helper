const priceAPI = require('./priceAPI');
const itemFacade = require('../item/itemFacade');
const stashFacade = require('../stash/stashFacade');

class priceFacade {
  static async priceStashes() {
    const stashes = await stashFacade.getStashes();
    return Promise.all(stashes.map(this.priceStash));
  }

  static async priceStash(stash) {
    const items = await itemFacade.getItemsFromStash(stash);
    await Promise.all(items.map(this.priceItem));
  }

  static async priceItem(item, forceUpdate) {
    let newItem = item;
    if (!item.price || forceUpdate) {
      const tradeQuery = await priceAPI.getTradeIds(item);
      const tradeObjects = await priceAPI.getTradeObjects(
        tradeQuery.id,
        tradeQuery.results.slice(0, 10),
      );

      const prices = tradeObjects.map((object) => ({
        amount: object.listing.price.amount,
        currency: object.listing.price.currency,
        seller: object.listing.account.lastCharacterName,
      }));

      newItem = { price: prices, ...item };
      await itemFacade.insertOrUpdateItemType(newItem);
    }
    return newItem;
  }

  static getPricingPoolSize() {
    return priceAPI.getPricePool().length;
  }
}

module.exports = priceFacade;
