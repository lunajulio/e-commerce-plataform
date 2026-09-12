// src/application/use-cases/delete-order.usecase.test.js
const { deleteOrderUseCase } = require('./delete-order.usecase');

describe('deleteOrderUseCase', () => {
  function buildMockRepository(deleteResult) {
    return {
      deleteById: jest.fn(async () => deleteResult),
    };
  }

  test('devuelve true cuando el pedido existe y se elimina', async () => {
    const ordersRepository = buildMockRepository(true);
    const execute = deleteOrderUseCase({ ordersRepository });

    const result = await execute(1);

    expect(result).toBe(true);
    expect(ordersRepository.deleteById).toHaveBeenCalledWith(1);
  });

  test('devuelve false cuando el pedido no existe', async () => {
    const ordersRepository = buildMockRepository(false);
    const execute = deleteOrderUseCase({ ordersRepository });

    const result = await execute(999);

    expect(result).toBe(false);
  });
});