// src/lib/config/validateEnv.ts
export function validateEnv() {
  // Required environment variables
  const requiredVars = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME,
  };

  // Check for missing variables
  const missingVars = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  // Validate AWS credentials format
  if (!/^AKIA[0-9A-Z]{16}$/.test(process.env.AWS_ACCESS_KEY_ID!)) {
    throw new Error('Invalid AWS Access Key ID format');
  }

  // Validate secret key is present and not empty
  if (!process.env.AWS_SECRET_ACCESS_KEY?.trim()) {
    throw new Error('AWS Secret Access Key is empty');
  }

  return true;
}