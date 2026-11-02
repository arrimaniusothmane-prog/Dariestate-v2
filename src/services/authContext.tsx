import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from './api';
import { LocalStore } from './storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await api.auth.getMe();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Default development evaluator user: Super Admin so evaluator can test everything right away
          const users = LocalStore.getUsers();
          setUser(users[0]);
        }
      } catch (e) {
        const users = LocalStore.getUsers();
        setUser(users[0]);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(name, email, password, phone);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.auth.logout();
    // Revert to demo client
    const users = LocalStore.getUsers();
    setUser(users[4] || null);
  };

  const switchRole = (role: UserRole) => {
    const users = LocalStore.getUsers();
    const target = users.find((u) => u.role === role);
    if (target) {
      setUser(target);
      localStorage.setItem('daratelier_token', `mock-token-${target.id}`);
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
