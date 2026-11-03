import {
  Property,
  ConstructionProject,
  DesignProject,
  Review,
  User,
  CompanySettings,
  Inquiry,
  QuoteRequest,
  ActivityLog,
  MediaAsset,
  FilterState,
} from '../types';
import { LocalStore } from './storage';

const API_BASE = '/api/v1';

// Helper to determine if we should attempt server first
async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1200) });
    return res.ok;
  } catch (e) {
    return false;
  }
}

// Token helper
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('daratelier_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  auth: {
    login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
      // Check server
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.success) {
            localStorage.setItem('daratelier_token', data.token);
            return { token: data.token, user: data.user };
          }
        } catch (e) {
          console.warn('Backend login attempt failed, falling back to local simulation:', e);
        }
      }

      // Demonstration mode fallback
      const users = LocalStore.getUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && user.isActive) {
        const fakeToken = `mock-token-${user.id}-${Date.now()}`;
        localStorage.setItem('daratelier_token', fakeToken);
        localStorage.setItem('daratelier_user_id', user.id);
        return { token: fakeToken, user };
      }
      throw new Error('Identifiants de démonstration incorrects.');
    },

    register: async (name: string, email: string, password: string, phone?: string): Promise<{ token: string; user: User }> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone }),
          });
          const data = await res.json();
          if (data.success) {
            localStorage.setItem('daratelier_token', data.token);
            if (data.user?.id) localStorage.setItem('daratelier_user_id', data.user.id);
            return { token: data.token, user: data.user };
          }
        } catch (e) {
          console.warn('Backend register attempt failed, falling back to local simulation:', e);
        }
      }

      const newUser = LocalStore.createUser({
        name,
        email,
        phone,
        role: 'CLIENT',
        isActive: true,
      });
      const fakeToken = `mock-token-${newUser.id}-${Date.now()}`;
      localStorage.setItem('daratelier_token', fakeToken);
      localStorage.setItem('daratelier_user_id', newUser.id);
      return { token: fakeToken, user: newUser };
    },

    getMe: async (): Promise<User | null> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: getAuthHeader(),
          });
          const data = await res.json();
          if (data.success && data.user) return data.user;
        } catch (e) {
          // fallback
        }
      }

      // Local session: a token alone is not enough, we need the stored user id.
      const token = localStorage.getItem('daratelier_token');
      if (!token) return null;

      const storedUserId = localStorage.getItem('daratelier_user_id');
      const users = LocalStore.getUsers();
      if (storedUserId) {
        const sessionUser = users.find((u) => u.id === storedUserId);
        if (sessionUser) return sessionUser;
      }

      // Backward compatibility with tokens created before the user id key existed.
      if (token.startsWith('mock-token-')) {
        const withoutPrefix = token.replace('mock-token-', '');
        const matched = users.find((u) => withoutPrefix.startsWith(`${u.id}-`));
        if (matched) {
          localStorage.setItem('daratelier_user_id', matched.id);
          return matched;
        }
      }

      return null;
    },

    logout: async (): Promise<void> => {
      localStorage.removeItem('daratelier_token');
      localStorage.removeItem('daratelier_user_id');
    },
  },

  // Properties
  properties: {
    getAll: async (filters?: Partial<FilterState>): Promise<Property[]> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const params = new URLSearchParams();
          if (filters?.search) params.append('search', filters.search);
          if (filters?.type && filters.type !== 'ALL') params.append('type', filters.type);
          if (filters?.transactionType && filters.transactionType !== 'ALL') params.append('transactionType', filters.transactionType);
          if (filters?.city && filters.city !== 'ALL') params.append('city', filters.city);
          if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
          if (filters?.maxPrice && filters.maxPrice < 50000000) params.append('maxPrice', filters.maxPrice.toString());
          if (filters?.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
          if (filters?.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
          if (filters?.sort) params.append('sort', filters.sort);

          const res = await fetch(`${API_BASE}/properties?${params.toString()}`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) return json.data;
        } catch (e) {
          // fallback
        }
      }

      // Local filtering
      let list = LocalStore.getProperties();

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        list = list.filter((p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }

      if (filters?.transactionType && filters.transactionType !== 'ALL') {
        list = list.filter((p) => p.transactionType === filters.transactionType);
      }

      if (filters?.type && filters.type !== 'ALL') {
        list = list.filter((p) => p.type === filters.type);
      }

      if (filters?.city && filters.city !== 'ALL') {
        const targetCity = filters.city.toLowerCase();
        list = list.filter((p) => p.city.toLowerCase() === targetCity);
      }

      if (filters?.minPrice !== undefined) {
        const minP = filters.minPrice;
        list = list.filter((p) => p.price >= minP);
      }

      if (filters?.maxPrice !== undefined && filters.maxPrice < 50000000) {
        const maxP = filters.maxPrice;
        list = list.filter((p) => p.price <= maxP);
      }

      if (filters?.bedrooms) {
        list = list.filter((p) => p.bedrooms >= Number(filters.bedrooms));
      }

      if (filters?.bathrooms) {
        list = list.filter((p) => p.bathrooms >= Number(filters.bathrooms));
      }

      if (filters?.sort === 'priceAsc') {
        list = [...list].sort((a, b) => a.price - b.price);
      } else if (filters?.sort === 'priceDesc') {
        list = [...list].sort((a, b) => b.price - a.price);
      } else if (filters?.sort === 'surfaceDesc') {
        list = [...list].sort((a, b) => b.surfaceArea - a.surfaceArea);
      } else {
        // Newest
        list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      return list;
    },

    getBySlug: async (slug: string): Promise<Property | null> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties/${slug}`);
          const json = await res.json();
          if (json.success && json.data) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.getPropertyBySlug(slug) || null;
    },

    create: async (data: Partial<Property>): Promise<Property> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader(),
            },
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.createProperty(data);
    },

    update: async (id: string, updates: Partial<Property>): Promise<Property> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader(),
            },
            body: JSON.stringify(updates),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.updateProperty(id, updates);
    },

    delete: async (id: string): Promise<void> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          await fetch(`${API_BASE}/properties/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
          });
        } catch (e) {
          // fallback
        }
      }
      LocalStore.deleteProperty(id);
    },
  },

  // Inquiries
  inquiries: {
    submit: async (data: Partial<Inquiry>): Promise<Inquiry> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/inquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.createInquiry(data);
    },

    getAll: async (): Promise<Inquiry[]> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/inquiries`, { headers: getAuthHeader() });
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.getInquiries();
    },

    update: async (id: string, updates: Partial<Inquiry>, newNote?: string): Promise<Inquiry> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/inquiries/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify({ ...updates, newNote }),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.updateInquiry(id, updates, newNote);
    },
  },

  // Quotes
  quotes: {
    submit: async (data: Partial<QuoteRequest>): Promise<QuoteRequest> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/quotes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.createQuote(data);
    },

    getAll: async (): Promise<QuoteRequest[]> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/quotes`, { headers: getAuthHeader() });
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.getQuotes();
    },

    update: async (id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/quotes/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(updates),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.updateQuote(id, updates);
    },
  },

  // Construction
  construction: {
    getAll: async (): Promise<ConstructionProject[]> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/construction-projects`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) return json.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.getConstructionProjects();
    },

    update: async (id: string, updates: Partial<ConstructionProject>): Promise<ConstructionProject> => {
      return LocalStore.updateConstructionProject(id, updates);
    },

    create: async (data: Partial<ConstructionProject>): Promise<ConstructionProject> => {
      return LocalStore.createConstructionProject(data);
    },

    delete: async (id: string): Promise<void> => {
      LocalStore.deleteConstructionProject(id);
    },

    toggleMilestone: async (projectId: string, milestoneId: string): Promise<ConstructionProject> => {
      return LocalStore.toggleMilestone(projectId, milestoneId);
    },
  },

  // Design
  design: {
    getAll: async (category?: string): Promise<DesignProject[]> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const url = category && category !== 'ALL' ? `${API_BASE}/design-projects?category=${category}` : `${API_BASE}/design-projects`;
          const res = await fetch(url);
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) return json.data;
        } catch (e) {
          // fallback
        }
      }
      const list = LocalStore.getDesignProjects();
      if (category && category !== 'ALL') {
        return list.filter((p) => p.category === category);
      }
      return list;
    },

    create: async (data: Partial<DesignProject>): Promise<DesignProject> => {
      return LocalStore.createDesignProject(data);
    },

    update: async (id: string, updates: Partial<DesignProject>): Promise<DesignProject> => {
      return LocalStore.updateDesignProject(id, updates);
    },

    delete: async (id: string): Promise<void> => {
      LocalStore.deleteDesignProject(id);
    },
  },

  // Users
  users: {
    getAll: async (): Promise<User[]> => {
      return LocalStore.getUsers();
    },
    create: async (data: Partial<User>): Promise<User> => {
      return LocalStore.createUser(data);
    },
    update: async (id: string, updates: Partial<User>): Promise<User> => {
      return LocalStore.updateUser(id, updates);
    },
    delete: async (id: string): Promise<void> => {
      LocalStore.deleteUser(id);
    },
  },

  // Settings
  settings: {
    get: async (): Promise<CompanySettings> => {
      return LocalStore.getSettings();
    },
    update: async (updates: Partial<CompanySettings>): Promise<CompanySettings> => {
      return LocalStore.updateSettings(updates);
    },
  },

  // Reviews
  reviews: {
    getAll: async (): Promise<Review[]> => {
      return LocalStore.getReviews();
    },
    create: async (data: Partial<Review>): Promise<Review> => {
      return LocalStore.createReview(data);
    },
    update: async (id: string, updates: Partial<Review>): Promise<Review> => {
      return LocalStore.updateReview(id, updates);
    },
    delete: async (id: string): Promise<void> => {
      LocalStore.deleteReview(id);
    },
  },

  // Activity
  activity: {
    getAll: async (): Promise<ActivityLog[]> => {
      return LocalStore.getActivityLogs();
    },
  },

  // Media
  media: {
    getAll: async (): Promise<MediaAsset[]> => {
      return LocalStore.getMedia();
    },
    add: async (data: Partial<MediaAsset>): Promise<MediaAsset> => {
      return LocalStore.addMedia(data);
    },
    delete: async (id: string): Promise<void> => {
      LocalStore.deleteMedia(id);
    },
    upload: async (file: File): Promise<{ url: string; filename: string }> => {
      // In demonstration mode, simulate instant preview url or real FormData
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            url: reader.result as string,
            filename: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    },
  },
};
