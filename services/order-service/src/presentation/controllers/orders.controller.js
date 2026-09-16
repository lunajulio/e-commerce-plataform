function createOrdersController({ createOrder, getOrders, getOrderById, deleteOrder, updateOrderStatus }) {
  function parseOrderId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
  }

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
        const id = parseOrderId(req.params.id);
        if (id === null) return res.status(400).json({ error: 'id must be a positive integer' });

        const order = await getOrderById(id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(order);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    async remove(req, res) {
      try {
        const id = parseOrderId(req.params.id);
        if (id === null) return res.status(400).json({ error: 'id must be a positive integer' });

        const deleted = await deleteOrder(id);
        if (!deleted) return res.status(404).json({ error: 'Order not found' });
        res.status(204).send();
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
    async updateStatus(req, res) {
      try {
        const id = parseOrderId(req.params.id);
        if (id === null) return res.status(400).json({ error: 'id must be a positive integer' });

        const result = await updateOrderStatus(id, req.body.status);
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