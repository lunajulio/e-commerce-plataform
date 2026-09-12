function getOrderByIdUseCase({ ordersRepository }) {
  return async function execute(id) {
    return await ordersRepository.findById(id);
  };
}

module.exports = { getOrderByIdUseCase };