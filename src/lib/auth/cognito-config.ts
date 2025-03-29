// src/lib/auth/cognito-config.ts
import { Amplify } from 'aws-amplify';

export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'us-east-2_PhMGK85cM',
        userPoolClientId: '72l24umfcadecu4uttgfc93bet',
        loginWith: {
          oauth: {
            domain: 'your-cognito-domain',
            scopes: ['openid', 'email', 'profile'],
            redirectSignIn: ['http://localhost:3000'],
            redirectSignOut: ['http://localhost:3000'],
            responseType: 'code'
          },
          username: true,
          email: true,
        }
      }
    }
  });
};