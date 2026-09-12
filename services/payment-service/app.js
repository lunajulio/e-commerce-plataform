const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'payment-service' });
});

app.post('/payments', (req, res) => {
  const { orderId, amount } = req.body;

  if (!orderId || !amount) {
    return res.status(400).json({ error: 'orderId y amount son requeridos' });
  }

  // Simulación: todo pago se aprueba por ahora, sin lógica real.
  const payment = { orderId, amount, status: 'approved' };
  res.status(201).json(payment);
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Payment Service listening on port ${PORT}`));