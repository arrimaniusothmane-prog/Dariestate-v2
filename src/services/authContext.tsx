import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from './api';
import { LocalStore } from './storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<User>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'AGENT',
  'CONSTRUCTION_MANAGER',
  'INTERIOR_DESIGNER',
  'SALES_REP',
];

/** True when the visitor may enter the administration area. */
export function isStaffRole(role?: UserRole | null): boolean {
  return !!role && ADMIN_ROLES.includes(role);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Session-based: no token / no stored user id means a visitor, not a default admin.
        const currentUser = await api.auth.getMe();
        setUser(currentUser);
      } catch (e) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(name, email, password, phone);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    void api.auth.logout();
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    const users = LocalStore.getUsers();
    const target = users.find((u) => u.role === role && u.isActive);
    if (target) {
      setUser(target);
      localStorage.setItem('daratelier_token', `mock-token-${target.id}-${Date.now()}`);
      localStorage.setItem('daratelier_user_id', target.id);
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
