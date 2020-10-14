function addPrices(list, prices) {
  const container = document.createElement('ul');
  container.classList.add('list');
  prices.forEach((price) => {
    const priceEl = document.createElement('li');
    priceEl.classList.add('list-item');

    const amount = document.createElement('div');
    const imageContainer = document.createElement('div');
    const image = document.createElement('img');

    image.classList.add('image');

    amount.textContent = `${price.amount} x ${price.currency}`;
    image.src = `${__dirname}/currency/${price.currency}.png`;

    priceEl.appendChild(amount);
    priceEl.appendChild(imageContainer);
    imageContainer.appendChild(image);

    container.appendChild(priceEl);
  });
  list.appendChild(container);
}

function buildList(priceList, prices) {
  const header = document.createElement('div');
  const list = document.createElement('div');

  priceList.classList.add('frame');
  priceList.classList.add('price');
  header.classList.add('header');
  list.classList.add('body');

  addPrices(list, prices);

  header.textContent = 'Price asc';

  priceList.appendChild(header);
  priceList.appendChild(list);
  priceList.setAttribute('id', 'price-list');
}

function clearChildren(element) {
  while (element.lastElementChild) {
    element.removeChild(element.lastElementChild);
  }
}

function createPriceList(div, price) {
  const highlighted = document.body.querySelector('.highlighted');
  let priceList = document.body.querySelector('#price-list');
  if (highlighted) highlighted.classList.remove('highlighted');
  if (priceList) document.body.removeChild(priceList);

  priceList = document.createElement('div');
  div.classList.add('highlighted');

  clearChildren(priceList);
  buildList(priceList, price);

  document.body.append(priceList);
}

function createPriceHint(price) {
  const amount = document.createElement('span');
  const imageContainer = document.createElement('div');
  const currencyImage = document.createElement('img');

  amount.textContent = price.amount;
  amount.classList.add('numbers');
  currencyImage.src = `${__dirname}/currency/${price.currency}.png`;

  imageContainer.appendChild(currencyImage);
  const container = document.createElement('div');
  container.classList.add('container');
  container.appendChild(amount);
  container.appendChild(imageContainer);
  return container;
}

function createSquare(pos, size, price) {
  const div = document.createElement('div');
  div.classList.add('highlight');
  div.style.position = 'absolute';
  div.style.top = pos.y;
  div.style.left = pos.x;
  div.style.width = size.w;
  div.style.height = size.h;

  const priceHint = createPriceHint(price);
  div.appendChild(priceHint);
  return div;
}

class HighlightCreator {
  static getHighlightSquare(pos, size, priceList) {
    const div = createSquare(pos, size, priceList[0]);

    div.onmouseenter = () => {
      createPriceList(div, priceList);
    };

    return div;
  }
}

module.exports = HighlightCreator;
