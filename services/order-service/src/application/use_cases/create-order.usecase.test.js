const { createOrderUseCase } = require('./create-order.usecase');

describe('createOrderUseCase', () => {
  function buildMockRepository() {
    return {
      save: jest.fn(async (order) => ({ ...order, id: 1 })),
    };
  }

  function buildMockEventBridgeClient() {
    return {
      publish: jest.fn(async () => {}),
    };
  }

  const pricingService = {
    getPrice: (product) => (product === 'laptop' ? 1500 : 0),
    calculateTotal: (product, quantity) => (product === 'laptop' ? 1500 * quantity : 0),
    LARGE_ORDER_THRESHOLD: 10,
  };

  test('crea un pedido válido y lo guarda en el repositorio', async () => {
    const ordersRepository = buildMockRepository();
    const eventBridgeClient = buildMockEventBridgeClient();
    const execute = createOrderUseCase({ ordersRepository, pricingService, eventBridgeClient });

    const result = await execute({ product: 'laptop', quantity: 2 });

    expect(result.order).toEqual({ id: 1, product: 'laptop', quantity: 2, total: 3000, status: 'created' });
    expect(ordersRepository.save).toHaveBeenCalledTimes(1);
    expect(eventBridgeClient.publish).toHaveBeenCalledTimes(1);
  });

  test('devuelve error si falta quantity, sin llamar al repositorio', async () => {
    const ordersRepository = buildMockRepository();
    const eventBridgeClient = buildMockEventBridgeClient();
    const execute = createOrderUseCase({ ordersRepository, pricingService, eventBridgeClient });

    const result = await execute({ product: 'laptop' });

    expect(result.error).toBe('quantity required');
    expect(ordersRepository.save).not.toHaveBeenCalled();
    expect(eventBridgeClient.publish).not.toHaveBeenCalled();
  });
});