// src/lib/dynamodb.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Constants for table names
export const TABLE_NAMES = {
  TRIPS: process.env.DYNAMODB_TABLE_NAME || 'trips',
  REGISTRATIONS: process.env.DYNAMODB_REGISTRATIONS_TABLE_NAME || 'trip_registrations'
};

// Basic client configuration
const config = {
  region: 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
};

console.log('DynamoDB Config:', {
  region: config.region,
  hasAccessKey: !!config.credentials.accessKeyId,
  accessKeyStart: config.credentials.accessKeyId.substring(0, 4),
  hasSecretKey: !!config.credentials.secretAccessKey,
  secretKeyLength: config.credentials.secretAccessKey.length
});

const client = new DynamoDBClient(config);

// Create the document client
export const dynamo = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: true,
    convertClassInstanceToMap: true,
  }
});