/* heii te amo bjs malena */
const stash = require('./stash/stashFacade');
const item = require('./item/itemFacade');
const gui = require('./gui/manager');

async function init() {
  await item.updateItemTypes();
  await stash.updateStashTabs();
  await item.updateItems();
}

init();

// setInterval(init, 10000);
// gui.init();
