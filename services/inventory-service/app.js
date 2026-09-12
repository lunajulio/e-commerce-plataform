const express = require('express');

const app = express();
app.use(express.json());

const stock = {
  laptop: 50,
  mouse: 200,
};

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'inventory-service' });
});

app.post('/inventory/check', (req, res) => {
  const { product, quantity } = req.body;

  const available = stock[product] ?? 0;
  const hasStock = available >= quantity;

  res.status(200).json({ product, available, hasStock });
});

const PORT = 3003;
app.listen(PORT, () => console.log(`Inventory Service listening on port ${PORT}`));