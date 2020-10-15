/* heii te amo bjs malena */
const stashFacade = require('./stash/stashFacade');
const itemFacade = require('./item/itemFacade');
const priceFacade = require('./price/priceFacade');
const gui = require('./gui/manager');

async function init() {
  await gui.init();
  await itemFacade.updateItemTypes();
  await stashFacade.updateStashTabs();
  await itemFacade.updateItems();
  const stash = await stashFacade.getStash({ n: '1' });
  const items = await itemFacade.getItemsFromStash(stash);
  const uniques = items.filter((item) => item.type === 'unique');
  await Promise.all(uniques.map((unique) => new Promise((resolve, reject) => {
    priceFacade.priceItem(unique)
      .then((pricedItem) => {
        gui.highlight(stash, pricedItem);
        resolve();
      })
      .catch(reject);
  })));
  gui.configure();
}

init();
