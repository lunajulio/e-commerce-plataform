const express = require('express');

function createOrdersRouter(ordersController) {
  const router = express.Router();

  router.post('/', ordersController.create);
  router.get('/', ordersController.list);
  router.get('/:id', ordersController.getById);
  router.delete('/:id', ordersController.remove);
  router.patch('/:id/status', ordersController.updateStatus);

  return router;
}

module.exports = { createOrdersRouter };