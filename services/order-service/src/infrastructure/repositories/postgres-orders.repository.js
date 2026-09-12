const pool = require('../database/pool');

function createPostgresOrdersRepository() {
  return {
    async save(orderData) {
      const { product, quantity, total, status } = orderData;
      const result = await pool.query(
        `INSERT INTO orders (product, quantity, total, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [product, quantity, total, status]
      );
      return result.rows[0];
    },
    async findAll() {
      const result = await pool.query('SELECT * FROM orders');
      return result.rows;
    },
    async findById(id) {
      const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
      return result.rows[0];
    },
    async deleteById(id) {
      const result = await pool.query('DELETE FROM orders WHERE id = $1', [id]);
      return result.rowCount > 0;
    },
    async updateStatus(id, status) {
      const result = await pool.query(
        `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    },
  };
}

module.exports = { createPostgresOrdersRepository };