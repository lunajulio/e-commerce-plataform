const VALID_STATUSES = ['created', 'paid', 'cancelled'];

function updateOrderStatusUseCase({ ordersRepository }) {
  return async function execute(id, status) {
    if (!VALID_STATUSES.includes(status)) {
      return { error: `status must be one of: ${VALID_STATUSES.join(', ')}` };
    }
    const order = await ordersRepository.updateStatus(id, status);
    if (!order) return { error: 'Order not found' };
    return { order };
  };
}

module.exports = { updateOrderStatusUseCase };