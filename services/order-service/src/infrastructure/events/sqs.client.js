const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

function createSqsClient({ region, queueUrl }) {
  const client = new SQSClient({ region });

  return {
    async sendOrderCreated(payload) {
      await client.send(new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(payload),
      }));
    },
  };
}

module.exports = { createSqsClient };