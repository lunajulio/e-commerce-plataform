function createOrdersController({ createOrder, getOrders, getOrderById, deleteOrder, updateOrderStatus }) {
  return {
    async create(req, res) {
      try {
        const result = await createOrder(req.body);
        if (result.error) return res.status(400).json({ error: result.error });
        res.status(201).json(result.order);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    async list(req, res) {
      try {
        res.status(200).json(await getOrders());
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    async getById(req, res) {
      try {
        const order = await getOrderById(Number(req.params.id));
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    async remove(req, res) {
      try {
        const deleted = await deleteOrder(Number(req.params.id));
        if (!deleted) return res.status(404).json({ error: 'Order not found' });
        res.status(204).send();
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    async updateStatus(req, res) {
      try {
        const result = await updateOrderStatus(Number(req.params.id), req.body.status);
        if (result.error) {
          const code = result.error === 'Order not found' ? 404 : 400;
          return res.status(code).json({ error: result.error });
        }
        res.status(200).json(result.order);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  };
}
module.exports = { createOrdersController };