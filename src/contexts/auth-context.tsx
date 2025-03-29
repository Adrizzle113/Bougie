// src/contexts/auth-context.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signIn, 
  signOut, 
  getCurrentUser, 
  fetchAuthSession,
  type SignInInput
} from 'aws-amplify/auth';

interface CognitoAccessTokenPayload {
  'cognito:groups'?: string[];
  [key: string]: any;
}

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userGroup: string | null;
  login: (data: SignInInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGroup, setUserGroup] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const payload = session.tokens?.accessToken?.payload as CognitoAccessTokenPayload;
      const groups = payload?.['cognito:groups'] || [];
      
      setUser(currentUser);
      setIsAuthenticated(true);
      setUserGroup(groups.includes('Admin') ? 'admin' : 'user');
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setUserGroup(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: SignInInput) => {
    const result = await signIn(data);
    if (result.isSignedIn) {
      await checkAuth();
      const path = userGroup === 'admin' ? '/dashboard/admin' : '/dashboard/user';
      router.push(path);
    }
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsAuthenticated(false);
    setUserGroup(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated, 
        userGroup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}