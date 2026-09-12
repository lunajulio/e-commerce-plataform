const PRICES = {
  laptop: 1500,
  mouse: 20,
};

const LARGE_ORDER_THRESHOLD = 10;

function getPrice(product) {
  return PRICES[product] ?? 0;
}

function calculateTotal(product, quantity) {
  return getPrice(product) * quantity;
}

module.exports = { getPrice, calculateTotal, LARGE_ORDER_THRESHOLD };