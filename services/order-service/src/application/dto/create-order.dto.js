function validateCreateOrderInput({ product, quantity }) {
  if (product == null) return 'product required';
  if (quantity == null) return 'quantity required';
  if (quantity <= 0) return 'quantity must be positive';
  return null;
}

module.exports = { validateCreateOrderInput };