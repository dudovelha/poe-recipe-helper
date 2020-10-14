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
  const pricedItem = await priceFacade.priceItem(uniques[0]);
  const pricedItem2 = await priceFacade.priceItem(uniques[1]);
  await gui.highlight(stash, pricedItem);
  await gui.highlight(stash, pricedItem2);
  gui.configure();
}

init();
