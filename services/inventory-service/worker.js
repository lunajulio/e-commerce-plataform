require('dotenv').config({ override: true });
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');

const client = new SQSClient({ region: process.env.AWS_REGION });
const queueUrl = process.env.SQS_INVENTORY_QUEUE_URL;

if (!queueUrl) {
  throw new Error('Falta SQS_INVENTORY_QUEUE_URL en services/inventory-service/.env');
}

const stock = { laptop: 50, mouse: 200 };

async function processMessage(message) {
  const event = JSON.parse(message.Body);
  const payload = event.detail ?? event;
  const available = stock[payload.product] ?? 0;
  console.log(`[inventory-worker] Pedido ${payload.orderId}: stock de ${payload.product} = ${available}, solicitado ${payload.quantity}`);
}

async function poll() {
  while (true) {
    const result = await client.send(new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 5,
      WaitTimeSeconds: 10,
    }));

    for (const message of result.Messages ?? []) {
      try {
        await processMessage(message);
        await client.send(new DeleteMessageCommand({ QueueUrl: queueUrl, ReceiptHandle: message.ReceiptHandle }));
      } catch (err) {
        console.error(`[inventory-worker] Error: ${err.message}`);
      }
    }
  }
}

poll();
console.log('[inventory-worker] Escuchando order-created-inventory-queue...');