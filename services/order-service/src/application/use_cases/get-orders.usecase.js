function getOrdersUseCase({ ordersRepository }) {
  return async function execute() {
    return await ordersRepository.findAll();
  };
}

module.exports = { getOrdersUseCase };