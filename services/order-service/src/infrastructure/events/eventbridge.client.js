const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge');

function createEventBridgeClient({ region, eventBusName }) {
  const client = new EventBridgeClient({ region });

  return {
    async publish(detailType, detail) {
      await client.send(new PutEventsCommand({
        Entries: [
          {
            EventBusName: eventBusName,
            Source: 'orders.order-service',
            DetailType: detailType,
            Detail: JSON.stringify(detail),
          },
        ],
      }));
    },
  };
}

module.exports = { createEventBridgeClient };