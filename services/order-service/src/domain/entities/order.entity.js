function createOrder({ id, product, quantity, total, status = 'created' }) {
  return { id, product, quantity, total, status };
}

module.exports = { createOrder };