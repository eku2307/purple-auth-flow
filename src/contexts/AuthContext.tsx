import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '@/lib/auth';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, upiId: string, password: string) => Promise<void>;
  logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
  const response = await authService.login({ email, password });
  setUser(response);
  setIsNewUser(false);
};


  const register = async (name: string, email: string, upiId: string, password: string) => {
  await authService.register({ name, email, upiId, password });
  const response = await authService.login({ email, password });
  setUser(response);
  setIsNewUser(true);
};


  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
  value={{
    user,
    isAuthenticated: !!user,
    isLoading,
    isNewUser,
    login,
    register,
    logout,
  }}
>

    
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
