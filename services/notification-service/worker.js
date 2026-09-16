require('dotenv').config({ override: true });
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');

const client = new SQSClient({ region: process.env.AWS_REGION });
const queueUrl = process.env.SQS_NOTIFICATION_QUEUE_URL;

if (!queueUrl) {
  throw new Error('Falta SQS_NOTIFICATION_QUEUE_URL en services/notification-service/.env');
}

async function processMessage(message) {
  const event = JSON.parse(message.Body);
  const payload = event.detail ?? event;
  console.log(`[notification-worker] Enviando confirmación del pedido ${payload.orderId} (simulado)`);
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
        console.error(`[notification-worker] Error: ${err.message}`);
      }
    }
  }
}

poll();
console.log('[notification-worker] Escuchando order-created-notification-queue...');