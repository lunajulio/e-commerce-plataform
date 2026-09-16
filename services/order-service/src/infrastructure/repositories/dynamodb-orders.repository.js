const { randomUUID } = require('crypto');
const { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require('../database/dynamo-client');

const TABLE_NAME = 'Orders';

function createDynamoOrdersRepository() {
  return {
    async save(orderData) {
      const order = { orderId: randomUUID(), ...orderData };
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: order }));
      return order;
    },
    async findAll() {
      const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
      return result.Items ?? [];
    },
    async findById(orderId) {
      const result = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { orderId } }));
      return result.Item;
    },
    async deleteById(orderId) {
      const existing = await this.findById(orderId);
      if (!existing) return false;
      await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { orderId } }));
      return true;
    },
    async updateStatus(orderId, status) {
      const result = await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { orderId },
        UpdateExpression: 'SET #s = :status',
        ExpressionAttributeNames: { '#s': 'status' },
        ExpressionAttributeValues: { ':status': status },
        ReturnValues: 'ALL_NEW',
      }));
      return result.Attributes;
    },
  };
}

module.exports = { createDynamoOrdersRepository };