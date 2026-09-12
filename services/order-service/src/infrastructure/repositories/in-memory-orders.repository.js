function createInMemoryOrdersRepository() {
  let orders = [];
  let nextId = 1;

  return {
    save(orderData) {
      const order = { ...orderData, id: nextId++ };
      orders.push(order);
      return order;
    },
    findAll() {
      return orders;
    },
    findById(id) {
      return orders.find((o) => o.id === id);
    },
    deleteById(id) {
      const index = orders.findIndex((o) => o.id === id);
      if (index === -1) return false;
      orders.splice(index, 1);
      return true;
    },
    updateStatus(id, status) {
      const order = orders.find((o) => o.id === id);
      if (!order) return undefined;
      order.status = status;
      return order;
    },
  };
}

module.exports = { createInMemoryOrdersRepository };