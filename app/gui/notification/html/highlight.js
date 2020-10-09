function debounce(func, wait) {
  let timeout;
  return function debouced() {
    const context = this;
    const later = function later() {
      timeout = null;
      func.apply(context);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function deletePriceList() {
  const highlighted = document.body.querySelector('.highlighted');
  const priceList = document.body.querySelector('#price-list');
  if (priceList) document.removeChild(priceList);
  if (highlighted) highlighted.classList.remove('highlighted');
}

function createPriceList(body, div) {
  const highlighted = body.querySelector('.highlighted');
  let priceList = body.querySelector('#price-list');
  if (!priceList) priceList = document.createElement('div');
  if (highlighted) highlighted.classList.remove('highlighted');

  div.classList.add('highlighted');
  debounce(deletePriceList, 1000);
}

class HighlightCreator {
  static getHighlightSquare(pos, size) {
    const div = document.createElement('div');
    div.classList.add('highlight');
    div.style.position = 'absolute';
    div.style.top = pos.y;
    div.style.left = pos.x;
    div.style.width = size.w;
    div.style.height = size.h;

    div.onmouseenter = () => {
      createPriceList(document.body, div);
    };

    return div;
  }
}

module.exports = HighlightCreator;
