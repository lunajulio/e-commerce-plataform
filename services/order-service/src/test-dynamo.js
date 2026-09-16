// test-dynamo.js, temporal, en la raíz de order-service
const { createDynamoOrdersRepository } = require('./infrastructure/repositories/dynamodb-orders.repository');

(async () => {
  const repo = createDynamoOrdersRepository();
  const saved = await repo.save({ product: 'laptop', quantity: 2, total: 3000, status: 'created' });
  console.log('Guardado:', saved);

  const found = await repo.findById(saved.orderId);
  console.log('Encontrado:', found);

  const updated = await repo.updateStatus(saved.orderId, 'paid');
  console.log('Actualizado:', updated);
})();