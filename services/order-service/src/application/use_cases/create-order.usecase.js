const { validateCreateOrderInput } = require('../dto/create-order.dto');
const { createOrder } = require('../../domain/entities/order.entity');

function createOrderUseCase({ ordersRepository, pricingService, paymentClient }) {
  return async function execute(input) {
    const validationError = validateCreateOrderInput(input);
    if (validationError) return { error: validationError };

    const total = pricingService.calculateTotal(input.product, input.quantity);
    const order = createOrder({ product: input.product, quantity: input.quantity, total, status: 'created' });
    const saved = await ordersRepository.save(order);

    const paymentResult = await paymentClient.charge({ orderId: saved.id, amount: total });
    const finalStatus = paymentResult.success ? 'paid' : 'payment_failed';
    const updated = await ordersRepository.updateStatus(saved.id, finalStatus);

    if (!paymentResult.success) {
      console.error(`Payment failed for order ${saved.id}: ${paymentResult.reason}`);
    }

    return { order: updated };
  };
}

module.exports = { createOrderUseCase };