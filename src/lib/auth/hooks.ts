// src/lib/auth/hooks.ts
import { useState, useCallback, useEffect } from 'react';
import { 
  signIn as awsSignIn,
  signUp as awsSignUp,
  confirmSignUp as awsConfirmSignUp,
  resetPassword as awsResetPassword,
  confirmResetPassword as awsConfirmResetPassword,
  getCurrentUser,
  signOut,
  resendSignUpCode
} from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

interface SignUpData {
  email: string;
  password: string;
  given_name: string;
  family_name: string;
  name: string;
  nickname: string;
  picture: string;
}

type CognitoError = {
  message: string;
  name: string;
  code?: string;
} & Error;

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const handleAuthError = useCallback((err: CognitoError) => {
    console.log('Handling auth error:', err);
    
    switch (err.name) {
      case 'UserAlreadyAuthenticatedException':
        router.push('/dashboard');
        break;
      case 'UserNotConfirmedException':
        setError('Please verify your email first.');
        break;
      case 'NotAuthorizedException':
        setError('Incorrect username or password.');
        break;
      case 'UserNotFoundException':
        setError('User does not exist.');
        break;
      default:
        setError(err.message || 'An unexpected error occurred.');
        break;
    }
  }, [router]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        router.push('/dashboard');
      }
    } catch {
      setIsAuthenticated(false);
      console.log('No authenticated user');
    }
  }, [router]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isAuthenticated) {
        router.push('/dashboard');
        return;
      }

      const result = await awsSignIn({
        username: email,
        password,
      });
      console.log('Sign in successful:', result);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (err) {
      const cognitoError = err as CognitoError;
      console.error('Sign in error:', cognitoError);
      
      if (cognitoError.name === 'UserAlreadyAuthenticatedException') {
        setIsAuthenticated(true);
        router.push('/dashboard');
        return;
      }
      
      handleAuthError(cognitoError);
    } finally {
      setIsLoading(false);
    }
  }, [router, isAuthenticated, handleAuthError]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      router.push('/auth/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }, [router]);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await awsResetPassword({
        username: email
      });
    } catch (err) {
      const cognitoError = err as CognitoError;
      handleAuthError(cognitoError);
      throw cognitoError;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  const confirmResetPassword = useCallback(async ({ 
    username, 
    newPassword, 
    confirmationCode 
  }: { 
    username: string; 
    newPassword: string; 
    confirmationCode: string; 
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      await awsConfirmResetPassword({
        username,
        newPassword,
        confirmationCode
      });
    } catch (err) {
      const cognitoError = err as CognitoError;
      handleAuthError(cognitoError);
      throw cognitoError;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  const signUp = useCallback(async (data: SignUpData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await awsSignUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            given_name: data.given_name,
            family_name: data.family_name,
            name: data.name,
            nickname: data.nickname,
            picture: data.picture
          }
        }
      });
      console.log('Sign up successful:', result);
      return result;
    } catch (err) {
      console.error('Sign up error:', err);
      const cognitoError = err as CognitoError;
      handleAuthError(cognitoError);
      throw cognitoError;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  const resendSignUp = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await resendSignUpCode({
        username: email
      });
    } catch (err) {
      const cognitoError = err as CognitoError;
      handleAuthError(cognitoError);
      throw cognitoError;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  const confirmSignUp = useCallback(async (email: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await awsConfirmSignUp({ 
        username: email, 
        confirmationCode: code 
      });
    } catch (err) {
      const cognitoError = err as CognitoError;
      handleAuthError(cognitoError);
      throw cognitoError;
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthError]);

  return {
    signIn,
    signUp,
    confirmSignUp,
    resetPassword,
    confirmResetPassword,
    signOut: handleSignOut,
    resendSignUp,
    isLoading,
    error,
    isAuthenticated
  };
}