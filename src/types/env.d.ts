// src/types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DYNAMODB_TABLE_NAME: string;
      DYNAMODB_REGISTRATIONS_TABLE_NAME: string;
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};