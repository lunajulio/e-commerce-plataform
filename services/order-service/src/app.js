const express = require('express');

const { createPostgresOrdersRepository } = require('./infrastructure/repositories/postgres-orders.repository');
// const { createInMemoryOrdersRepository } = require('./infrastructure/repositories/in-memory-orders.repository');
const pricingService = require('./domain/services/pricing.service');

const { createPaymentClient } = require('./infrastructure/http-clients/payment.client');

const paymentClient = createPaymentClient({ baseUrl: process.env.PAYMENT_SERVICE_URL });

const { createOrderUseCase } = require('./application/use_cases/create-order.usecase');
const { getOrdersUseCase } = require('./application/use_cases/get-orders.usecase');
const { getOrderByIdUseCase } = require('./application/use_cases/get-order-by-id.usecase');
const { deleteOrderUseCase } = require('./application/use_cases/delete-order.usecase');
const { updateOrderStatusUseCase } = require('./application/use_cases/update-order-status.usecase');

const { createOrdersController } = require('./presentation/controllers/orders.controller');
const { createOrdersRouter } = require('./presentation/routes/orders.routes');

const ordersRepository = createPostgresOrdersRepository();

const ordersController = createOrdersController({
  createOrder: createOrderUseCase({ ordersRepository, pricingService, paymentClient }),
  getOrders: getOrdersUseCase({ ordersRepository }),
  getOrderById: getOrderByIdUseCase({ ordersRepository }),
  deleteOrder: deleteOrderUseCase({ ordersRepository }),
  updateOrderStatus: updateOrderStatusUseCase({ ordersRepository }),
});

const app = express();
app.use(express.json());
app.use('/orders', createOrdersRouter(ordersController));

const PORT = 3001;
app.listen(PORT, () => console.log(`Order Service listening on port ${PORT}`));