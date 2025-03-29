// src/lib/dao/test-connection.ts
import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { dynamo } from "../dynamodb";

export async function testDynamoDBConnection() {
  try {
    // Try a simpler operation first
    console.log('Testing DynamoDB connection...');
    
    const command = new ListTablesCommand({
      Limit: 1
    });
    
    const response = await dynamo.send(command);
    console.log('DynamoDB connection successful:', {
      tableCount: response.TableNames?.length,
      firstTable: response.TableNames?.[0]
    });
    return true;
  } catch (error: any) {
    console.error('DynamoDB connection error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      $metadata: error.$metadata
    });
    return false;
  }
}