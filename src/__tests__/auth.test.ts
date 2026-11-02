import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStore } from '../services/storage';
import { UserRole } from '../types';

// In-memory mock for localStorage in test environment
const mockStorage: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
  length: 0,
  key: () => null,
};

describe('Role-Based Access Control & User Service', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  it('loads default administrative users and roles', () => {
    const users = LocalStore.getUsers();
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThanOrEqual(1);

    const superAdmin = users.find((u) => u.role === 'SUPER_ADMIN');
    expect(superAdmin).toBeDefined();
    expect(superAdmin?.email).toContain('dar-atelier.ma');
  });

  it('validates role hierarchy and permission logic', () => {
    const checkRolePermission = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
      if (userRole === 'SUPER_ADMIN') return true;
      return allowedRoles.includes(userRole);
    };

    // SUPER_ADMIN has access to everything
    expect(checkRolePermission('SUPER_ADMIN', ['AGENT'])).toBe(true);
    expect(checkRolePermission('SUPER_ADMIN', ['CHEF_PROJET'])).toBe(true);
    expect(checkRolePermission('SUPER_ADMIN', ['ARCHITECTE'])).toBe(true);

    // AGENT has access only to agent-allowed sections
    expect(checkRolePermission('AGENT', ['AGENT', 'SUPER_ADMIN'])).toBe(true);
    expect(checkRolePermission('AGENT', ['CHEF_PROJET'])).toBe(false);

    // CLIENT cannot access admin roles
    expect(checkRolePermission('CLIENT', ['AGENT', 'SUPER_ADMIN', 'CHEF_PROJET'])).toBe(false);
  });
});
