/* heii te amo bjs malena */
const gui = require('./gui/manager');
const config = require('./config/manager');

async function init() {
  await gui.init();
  Promise.all([gui.getWindow('main', ''), gui.getWindow('main', ''), gui.getWindow('main', '')]);
  /*
  await gui.creatWindow('highlight', 'highlight');
  await gui.creatWindow('config', 'config');
  gui.configure();
  await itemFacade.updateItemTypes();
  await stashFacade.updateStashTabs();
  await itemFacade.updateItems(true);
  const stash = await stashFacade.getStash({ n: '1' });
  const items = await itemFacade.getItemsFromStash(stash);
  const uniques = items;
  await Promise.all(uniques.map((unique) => new Promise((resolve, reject) => {
    priceFacade.priceItem(unique)
      .then(async (pricedItem) => {
        if (pricedItem.price) {
          await gui.highlight(stash, pricedItem);
        }
        resolve();
      })
      .catch(reject);
  })));
  */
}

 init();
