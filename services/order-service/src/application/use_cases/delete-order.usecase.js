function deleteOrderUseCase({ ordersRepository }) {
  return async function execute(id) {
    return await ordersRepository.deleteById(id);
  };
}

module.exports = { deleteOrderUseCase };