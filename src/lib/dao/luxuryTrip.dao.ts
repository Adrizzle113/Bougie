// src/lib/dao/luxuryTrip.dao.ts
import { 
  GetCommand, 
  PutCommand, 
  QueryCommand, 
  DeleteCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
import { dynamo } from "../dynamodb";
import { LuxuryTrip } from "@/types/luxuryTrip.types";
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'trips';

export class LuxuryTripDAO {
  static async createTrip(tripData: Omit<LuxuryTrip, 'id' | 'createdAt' | 'updatedAt'>): Promise<LuxuryTrip> {
    const now = new Date().toISOString();
    const trip: LuxuryTrip = {
      ...tripData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      status: tripData.status || 'draft'
    };

    await dynamo.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: trip,
    }));

    return trip;
  }

  static async getTrip(id: string): Promise<LuxuryTrip | null> {
    const result = await dynamo.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));

    return result.Item as LuxuryTrip || null;
  }

  static async listTrips(status?: 'draft' | 'published' | 'archived'): Promise<LuxuryTrip[]> {
    let command;

    if (status) {
      command = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'StatusIndex',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status'
        },
        ExpressionAttributeValues: {
          ':status': status
        }
      });
    } else {
      command = new ScanCommand({
        TableName: TABLE_NAME
      });
    }

    const result = await dynamo.send(command);
    return (result.Items || []) as LuxuryTrip[];
  }

  static async updateTrip(id: string, updates: Partial<LuxuryTrip>): Promise<LuxuryTrip> {
    // First get the existing trip
    const existingTrip = await this.getTrip(id);
    if (!existingTrip) {
      throw new Error('Trip not found');
    }

    const updatedTrip: LuxuryTrip = {
      ...existingTrip,
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    await dynamo.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedTrip,
      ConditionExpression: 'attribute_exists(id)' // Ensure the item exists
    }));

    return updatedTrip;
  }

  static async deleteTrip(id: string): Promise<void> {
    await dynamo.send(new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id }
    }));
  }
}