const path = require('path');
const express = require('express');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
  override: true,
});

const { createPostgresOrdersRepository } = require('./src/infrastructure/repositories/postgres-orders.repository');
const pricingService = require('./src/domain/services/pricing.service');
const { createPaymentClient } = require('./src/infrastructure/http-clients/payment.client');
const { createEventBridgeClient } = require('./src/infrastructure/events/eventbridge.client');

const { createOrderUseCase } = require('./src/application/use_cases/create-order.usecase');
const { getOrdersUseCase } = require('./src/application/use_cases/get-orders.usecase');
const { getOrderByIdUseCase } = require('./src/application/use_cases/get-order-by-id.usecase');
const { deleteOrderUseCase } = require('./src/application/use_cases/delete-order.usecase');
const { updateOrderStatusUseCase } = require('./src/application/use_cases/update-order-status.usecase');

const { createOrdersController } = require('./src/presentation/controllers/orders.controller');
const { createOrdersRouter } = require('./src/presentation/routes/orders.routes');



const eventBridgeClient = createEventBridgeClient({
  region: process.env.AWS_REGION,
  eventBusName: process.env.EVENT_BUS_NAME,
});


const ordersRepository = createPostgresOrdersRepository();

 const paymentClient = createPaymentClient({
  baseUrl: process.env.PAYMENT_SERVICE_URL,
 });

const ordersController = createOrdersController({
  createOrder: createOrderUseCase({ ordersRepository, pricingService, eventBridgeClient }),
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