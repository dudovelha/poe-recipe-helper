const PriceAPI = require('./priceAPI');
const ItemFacade = require('../item/itemFacade');
const StashFacade = require('../stash/stashFacade');

class priceFacade {
  static async priceStashes() {
    const stashes = await StashFacade.getStashes();
    return Promise.all(stashes.map(this.priceStash));
  }

  static async priceStash(stash) {
    const items = await ItemFacade.getItemsFromStash(stash);
    await Promise.all(items.map(this.priceItem));
  }

  static async priceItem(item, forceUpdate) {
    let newItem = item;
    if (!item.price || forceUpdate) {
      const tradeQuery = await PriceAPI.getTradeIds(item);
      const tradeObjects = await PriceAPI.getTradeObjects(
        tradeQuery.id,
        tradeQuery.results.slice(0, 10),
      );

      const prices = tradeObjects.map((object) => ({
        amount: object.listing.price.amount,
        currency: object.listing.price.currency,
        seller: object.listing.account.lastCharacterName,
      }));

      newItem = { price: prices, ...item };
      await ItemFacade.insertOrUpdateItemType(newItem);
    }
    return newItem;
  }

  static getPricingPoolSize() {
    return PriceAPI.getPricePool().length;
  }
}

module.exports = priceFacade;
