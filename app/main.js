/* heii te amo bjs malena */
const stashFacade = require('./stash/stashFacade');
const itemFacade = require('./item/itemFacade');
const priceFacade = require('./price/priceFacade');
const gui = require('./gui/manager');
const recipe = require('./recipe/manager');
const { logger } = require('./config/manager');

async function init() {
  await gui.init();
  /*
  await itemFacade.updateItemTypes();
  await stashFacade.updateStashTabs();
  await itemFacade.updateItems();
  console.log(recipe.getRecipeNames());
  */
  const stash = await stashFacade.getStash({ n: '1' });
  const items = await itemFacade.getItemsFromStash(stash);
  const uniques = items.filter((item) => item.type === 'unique');
  const pricedItem = await priceFacade.priceItem(uniques[0]);
  const pricedItem2 = await priceFacade.priceItem(uniques[1]);
  gui.highlight(stash, pricedItem);
  gui.highlight(stash, pricedItem2);
}

init();
