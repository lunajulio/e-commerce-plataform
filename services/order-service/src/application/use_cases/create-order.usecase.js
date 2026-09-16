const { validateCreateOrderInput } = require('../dto/create-order.dto');
const { createOrder } = require('../../domain/entities/order.entity');

function createOrderUseCase({ ordersRepository, pricingService, eventBridgeClient }) {
  return async function execute(input) {
    const validationError = validateCreateOrderInput(input);
    if (validationError) return { error: validationError };

    if (pricingService.getPrice(input.product) === 0) {
      return { error: 'product not supported' };
    }

    const total = pricingService.calculateTotal(input.product, input.quantity);
    const order = createOrder({ product: input.product, quantity: input.quantity, total, status: 'created' });
    const saved = await ordersRepository.save(order);

    await eventBridgeClient.publish('OrderCreated', {
      orderId: saved.id,
      product: saved.product,
      quantity: saved.quantity,
      total: saved.total,
    });

    if (input.quantity > pricingService.LARGE_ORDER_THRESHOLD) {
      console.log(`WARNING: large order ${saved.id}`);
    }

    return { order: saved };
  };
}

module.exports = { createOrderUseCase };