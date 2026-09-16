require('dotenv').config({ override: true });
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');

const client = new SQSClient({ region: process.env.AWS_REGION });
const queueUrl = process.env.SQS_ORDER_CREATED_QUEUE_URL;

if (!queueUrl) {
  throw new Error('Falta SQS_ORDER_CREATED_QUEUE_URL en services/payment-service/.env');
}

async function processMessage(message) {
  const event = JSON.parse(message.Body);
  const payload = event.detail ?? event;
  if (!Number.isInteger(Number(payload.orderId)) || Number(payload.orderId) <= 0) {
    throw new Error(`Mensaje inválido: orderId ausente o inválido (${payload.orderId})`);
  }

  console.log(`[payment-worker] Procesando pago del pedido ${payload.orderId}`);

  const approved = true; // simulación, sin lógica real de cobro todavía

  await fetch(`${process.env.ORDER_SERVICE_URL}/orders/${payload.orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: approved ? 'paid' : 'payment_failed' }),
  });
}

async function poll() {
  while (true) {
    const result = await client.send(new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 5,
      WaitTimeSeconds: 10,
    }));

    const messages = result.Messages ?? [];

    for (const message of messages) {
      try {
        await processMessage(message);
        await client.send(new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        }));
      } catch (err) {
        console.error(`[payment-worker] Error procesando mensaje, no se confirma: ${err.message}`);
      }
    }
  }
}

poll();
console.log('[payment-worker] Escuchando order-created-queue...');