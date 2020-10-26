const fs = require('fs');

function transitioned(event) {
  if (event.animationName === 'delete') {
    document.body.removeChild(event.target);
  }
}

function addPrices(list, prices) {
  const container = document.createElement('ul');
  container.classList.add('list');
  prices.forEach((price) => {
    const priceEl = document.createElement('li');
    priceEl.classList.add('list-item');

    const amount = document.createElement('div');
    const imageContainer = document.createElement('div');
    const seller = document.createElement('div');
    let image = document.createElement('img');

    amount.textContent = price.amount;
    seller.textContent = price.seller;
    const imageSrc = `${__dirname}/currency/${price.currency}.png`;
    if (fs.existsSync(imageSrc)) {
      image.src = imageSrc;
    } else {
      image = document.createElement('div');
      image.textContent = price.currency;
      image.classList.add('image-replacement');
    }

    priceEl.appendChild(amount);
    priceEl.appendChild(imageContainer);
    priceEl.appendChild(seller);
    imageContainer.appendChild(image);

    container.appendChild(priceEl);
  });
  list.appendChild(container);
}

function getPriceList(prices) {
  const priceList = document.createElement('div');
  const header = document.createElement('div');
  const headerText = document.createElement('h2');
  const list = document.createElement('div');

  priceList.classList.add('price');
  header.classList.add('header');
  headerText.classList.add('title');
  list.classList.add('body');
  list.classList.add('price-body');
  addPrices(list, prices);

  headerText.textContent = 'Price asc';

  header.appendChild(headerText);
  priceList.appendChild(header);
  priceList.appendChild(list);
  priceList.setAttribute('name', 'price-list');
  priceList.style.top = `${25 + (Math.random() * 20)}%`; // 30
  priceList.style.left = `${55 + (Math.random() * 20)}%`; // 60

  return priceList;
}

function clearPriceList() {
  const elements = document.getElementsByName('price-list');
  if (elements) {
    elements.forEach((element) => {
      element.classList.add('price-delete');
    });
  }
}

function createPriceList(div, price) {
  clearPriceList();
  const highlighted = document.body.querySelector('.highlighted');
  if (highlighted) highlighted.classList.remove('highlighted');

  div.classList.add('highlighted');

  const priceList = getPriceList(price);

  priceList.addEventListener('animationend', transitioned);
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
  div.style.width = size.w - 5;
  div.style.height = size.h - 5;

  const priceHint = createPriceHint(price);
  div.appendChild(priceHint);
  return div;
}

class HighlightCreator {
  static getHighlightSquare(pos, size, priceList) {
    const div = createSquare(pos, size, priceList[0]);

    div.onmouseenter = () => {
      if (!div.classList.contains('highlighted')) {
        createPriceList(div, priceList);
      }
    };

    return div;
  }
}

module.exports = HighlightCreator;
