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

export interface AdminPropertyFilters {
  search?: string;
  type?: string;
  transactionType?: string;
  city?: string;
  status?: string;
  isPublished?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

function propertyPayload(data: Partial<Property>) {
  const { images, features, ...rest } = data;
  const payload: Record<string, unknown> = { ...rest };

  if (features !== undefined) {
    payload.features = features.map((feature: any) =>
      typeof feature === 'string' ? feature : feature.name
    );
  }

  if (images !== undefined) {
    payload.images = images.map((image: any, index: number) => ({
      url: image.url,
      alt: image.alt,
      caption: image.caption,
      order: image.order ?? index,
      isCover: Boolean(image.isCover),
    }));
  }

  return payload;
}

async function readErrorMessage(res: Response): Promise<string> {
  try {
    const json = await res.json();
    return json.message || `Erreur serveur (${res.status})`;
  } catch {
    return `Erreur serveur (${res.status})`;
  }
}

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
            if (data.user?.id) localStorage.setItem('daratelier_user_id', data.user.id);
            return { token: data.token, user: data.user };
          }
          // The API is online: honour its authentication decision instead of
          // silently bypassing it with a local demo account.
          throw new Error(data.message || 'Identifiants incorrects.');
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Backend unreachable, using local demonstration session:', e);
          } else {
            throw e;
          }
        }
      }

      // Demonstration mode fallback (backend offline only)
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
          throw new Error(data.message || "Échec de l'inscription.");
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Backend unreachable, using local demonstration session:', e);
          } else {
            throw e;
          }
        }
      }

      const newUser = LocalStore.createUser({
        name,
        email,
        phone,
        role: 'CLIENT',
        isActive: true,
        isEmailVerified: true,
      });
      const fakeToken = `mock-token-${newUser.id}-${Date.now()}`;
      localStorage.setItem('daratelier_token', fakeToken);
      localStorage.setItem('daratelier_user_id', newUser.id);
      return { token: fakeToken, user: newUser };
    },

    getMe: async (): Promise<User | null> => {
      const isOnline = await checkServerHealth();
      const token = localStorage.getItem('daratelier_token');
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: getAuthHeader(),
          });
          const data = await res.json();
          if (data.success && data.user) return data.user;
          // Online + invalid/expired token means the visitor is not signed in.
          return null;
        } catch (e) {
          console.warn('Backend profile fetch failed, using local session:', e);
        }
      }

      // Local session: a token alone is not enough, we need the stored user id.
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

    verifyEmail: async (token: string): Promise<boolean> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/verify-email?token=${token}`);
          const data = await res.json();
          return data.success;
        } catch (e) {
          console.error('Email verification failed:', e);
          return false;
        }
      }
      return true; // Mock success in demo mode
    },

    resendVerification: async (email: string): Promise<boolean> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/resend-verification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          return data.success;
        } catch (e) {
          console.error('Resend verification failed:', e);
          return false;
        }
      }
      return true; // Mock success in demo mode
    },

    requestPasswordReset: async (email: string): Promise<boolean> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/request-password-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();
          return data.success;
        } catch (e) {
          console.error('Password reset request failed:', e);
          return false;
        }
      }
      return true; // Mock success in demo mode
    },

    resetPassword: async (token: string, password: string): Promise<boolean> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }),
          });
          const data = await res.json();
          return data.success;
        } catch (e) {
          console.error('Password reset failed:', e);
          return false;
        }
      }
      return true; // Mock success in demo mode
    },
  },

  // Properties
  properties: {
    getAll: async (filters?: Partial<FilterState>): Promise<Property[]> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const params = new URLSearchParams({ limit: '100' });
          if (filters?.search) params.append('search', filters.search);
          if (filters?.type && filters.type !== 'ALL') params.append('type', filters.type);
          if (filters?.transactionType && filters.transactionType !== 'ALL') params.append('transactionType', filters.transactionType);
          if (filters?.city && filters.city !== 'ALL') params.append('city', filters.city);
          if (filters?.neighborhood) params.append('neighborhood', filters.neighborhood);
          if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
          if (filters?.maxPrice && filters.maxPrice < 50000000) params.append('maxPrice', filters.maxPrice.toString());
          if (filters?.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
          if (filters?.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
          if (filters?.minSurface) params.append('minSurface', filters.minSurface.toString());
          if (filters?.sort) params.append('sort', filters.sort);

          const res = await fetch(`${API_BASE}/properties?${params.toString()}`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) return json.data;
          throw new Error(json.message || 'Impossible de charger les biens.');
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Property list request failed, using local data:', e);
          } else {
            throw e;
          }
        }
      }

      // Local filtering (offline demonstration mode)
      let list = LocalStore.getProperties().filter((property) => property.isPublished !== false && property.status !== 'DRAFT');

      if (filters?.search) {
        const q = filters.search.toLowerCase();
        list = list.filter((p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.reference || '').toLowerCase().includes(q)
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
        list = list.filter((p) => p.city.toLowerCase().includes(targetCity));
      }

      if (filters?.neighborhood) {
        const target = filters.neighborhood.toLowerCase();
        list = list.filter((p) => p.neighborhood.toLowerCase().includes(target));
      }

      if (filters?.minPrice !== undefined) {
        const minPrice = filters.minPrice;
        list = list.filter((p) => p.price >= minPrice);
      }

      if (filters?.maxPrice !== undefined && filters.maxPrice < 50000000) {
        const maxPrice = filters.maxPrice;
        list = list.filter((p) => p.price <= maxPrice);
      }

      if (filters?.bedrooms) {
        list = list.filter((p) => p.bedrooms >= Number(filters.bedrooms));
      }

      if (filters?.bathrooms) {
        list = list.filter((p) => p.bathrooms >= Number(filters.bathrooms));
      }

      if (filters?.minSurface) {
        list = list.filter((p) => p.surfaceArea >= Number(filters.minSurface));
      }

      if (filters?.sort === 'priceAsc') {
        list = [...list].sort((a, b) => a.price - b.price);
      } else if (filters?.sort === 'priceDesc') {
        list = [...list].sort((a, b) => b.price - a.price);
      } else if (filters?.sort === 'surfaceDesc') {
        list = [...list].sort((a, b) => b.surfaceArea - a.surfaceArea);
      } else {
        list = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      return list;
    },

    getAllAdmin: async (filters?: AdminPropertyFilters): Promise<Property[]> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const params = new URLSearchParams({ limit: String(filters?.limit || 250) });
          if (filters?.search) params.append('search', filters.search);
          if (filters?.type && filters.type !== 'ALL') params.append('type', filters.type);
          if (filters?.transactionType && filters.transactionType !== 'ALL') params.append('transactionType', filters.transactionType);
          if (filters?.city && filters.city !== 'ALL') params.append('city', filters.city);
          if (filters?.status && filters.status !== 'ALL') params.append('status', filters.status);
          if (filters?.isPublished !== undefined) params.append('isPublished', String(filters.isPublished));
          if (filters?.sort) params.append('sort', filters.sort);
          if (filters?.page) params.append('page', String(filters.page));

          const res = await fetch(`${API_BASE}/properties/admin/all?${params.toString()}`, {
            headers: getAuthHeader(),
          });
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) return json.data;
          throw new Error(json.message || 'Impossible de charger les biens.');
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Admin property list request failed, using local data:', e);
          } else {
            throw e;
          }
        }
      }
      return LocalStore.getProperties();
    },

    getBySlug: async (slug: string): Promise<Property | null> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties/${encodeURIComponent(slug)}`, {
            headers: getAuthHeader(),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
          return null;
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Property detail request failed, using local data:', e);
          } else {
            throw e;
          }
        }
      }
      return LocalStore.getPropertyBySlug(slug) || null;
    },

    getById: async (id: string): Promise<Property | null> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties/admin/${encodeURIComponent(id)}`, {
            headers: getAuthHeader(),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
          throw new Error(json.message || 'Bien introuvable.');
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Admin property detail request failed, using local data:', e);
          } else {
            throw e;
          }
        }
      }
      return LocalStore.getPropertyById(id) || null;
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
            body: JSON.stringify(propertyPayload(data)),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
          throw new Error(json.message || 'Impossible de créer le bien.');
        } catch (e) {
          if (e instanceof TypeError) {
            console.warn('Backend unreachable, saving locally:', e);
          } else {
            throw e;
          }
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
            body: JSON.stringify(propertyPayload(updates)),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
          throw new Error(json.message || 'Impossible de modifier le bien.');
        } catch (e) {
          if (e instanceof TypeError) {
            console.warn('Backend unreachable, saving locally:', e);
          } else {
            throw e;
          }
        }
      }
      return LocalStore.updateProperty(id, updates);
    },

    delete: async (id: string): Promise<void> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
          });
          if (!res.ok) throw new Error(await readErrorMessage(res));
          return;
        } catch (e) {
          if (e instanceof TypeError) {
            console.warn('Backend unreachable, deleting locally:', e);
          } else {
            throw e;
          }
        }
      }
      LocalStore.deleteProperty(id);
    },

    duplicate: async (id: string): Promise<Property> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties/${id}/duplicate`, {
            method: 'POST',
            headers: getAuthHeader(),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
          throw new Error(json.message || 'Impossible de dupliquer le bien.');
        } catch (e) {
          if (e instanceof TypeError) {
            console.warn('Backend unreachable, duplicating locally:', e);
          } else {
            throw e;
          }
        }
      }
      const source = LocalStore.getPropertyById(id);
      if (!source) throw new Error('Bien introuvable.');
      return LocalStore.createProperty({ ...source, title: `${source.title} (copie)`, status: 'DRAFT', isPublished: false, isFeatured: false });
    },

    publish: async (id: string): Promise<Property> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties/${id}/publish`, {
            method: 'PATCH',
            headers: getAuthHeader(),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
          throw new Error(json.message || 'Impossible de publier le bien.');
        } catch (e) {
          if (e instanceof TypeError) {
            console.warn('Backend unreachable, publishing locally:', e);
          } else {
            throw e;
          }
        }
      }
      return LocalStore.updateProperty(id, { isPublished: true, status: 'AVAILABLE' });
    },

    unpublish: async (id: string): Promise<Property> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties/${id}/unpublish`, {
            method: 'PATCH',
            headers: getAuthHeader(),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
          throw new Error(json.message || 'Impossible de dépublier le bien.');
        } catch (e) {
          if (e instanceof TypeError) {
            console.warn('Backend unreachable, unpublishing locally:', e);
          } else {
            throw e;
          }
        }
      }
      return LocalStore.updateProperty(id, { isPublished: false });
    },

    setStatus: async (id: string, status: Property['status']): Promise<Property> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/properties/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify({ status }),
          });
          const json = await res.json();
          if (json.success && json.data) return json.data;
          throw new Error(json.message || 'Impossible de modifier le statut.');
        } catch (e) {
          if (e instanceof TypeError) {
            console.warn('Backend unreachable, updating status locally:', e);
          } else {
            throw e;
          }
        }
      }
      return LocalStore.updateProperty(id, {
        status,
        availability: status === 'DRAFT' ? 'AVAILABLE' : status,
        isPublished: status === 'DRAFT' ? false : true,
      });
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
          throw new Error(json.message || "Impossible d'envoyer votre demande.");
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Backend unreachable, saving inquiry locally:', e);
          } else {
            throw e;
          }
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
          throw new Error(json.message || 'Impossible de charger les demandes.');
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Backend unreachable, reading inquiries locally:', e);
          } else {
            throw e;
          }
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
          throw new Error(json.message || 'Impossible de modifier la demande.');
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Backend unreachable, updating inquiry locally:', e);
          } else {
            throw e;
          }
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
          throw new Error(json.message || "Impossible d'envoyer votre demande de devis.");
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Backend unreachable, saving quote locally:', e);
          } else {
            throw e;
          }
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
          throw new Error(json.message || 'Impossible de charger les devis.');
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Backend unreachable, reading quotes locally:', e);
          } else {
            throw e;
          }
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
          throw new Error(json.message || 'Impossible de modifier le devis.');
        } catch (e) {
          if (e instanceof TypeError || (e instanceof DOMException && e.name === 'TimeoutError')) {
            console.warn('Backend unreachable, updating quote locally:', e);
          } else {
            throw e;
          }
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
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch(`${API_BASE}/media/upload`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: formData,
          });
          const json = await res.json();
          if (json.success && json.file) {
            return { url: json.file.url, filename: json.file.filename };
          }
          throw new Error(json.message || "Échec de l'upload.");
        } catch (e) {
          if (e instanceof TypeError) {
            console.warn('Backend unreachable, using local preview:', e);
          } else {
            throw e;
          }
        }
      }

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

    uploadMany: async (files: File[]): Promise<Array<{ url: string; filename: string }>> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const formData = new FormData();
          files.forEach((file) => formData.append('files', file));
          const res = await fetch(`${API_BASE}/media/upload-multiple`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: formData,
          });
          const json = await res.json();
          if (json.success && Array.isArray(json.files)) {
            return json.files.map((file: any) => ({ url: file.url, filename: file.filename }));
          }
          throw new Error(json.message || "Échec de l'upload.");
        } catch (e) {
          if (e instanceof TypeError) {
            console.warn('Backend unreachable, using local previews:', e);
          } else {
            throw e;
          }
        }
      }

      return Promise.all(files.map((file) => api.media.upload(file)));
    },
  },

  // Favorites
  favorites: {
    getAll: async (): Promise<Property[]> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/favorites`, {
            headers: getAuthHeader(),
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) return data.data;
        } catch (e) {
          // fallback
        }
      }
      return LocalStore.getProperties().filter(p => {
        const favIds = JSON.parse(localStorage.getItem('daratelier_favorites') || '[]');
        return favIds.includes(p.id);
      });
    },

    add: async (propertyId: string): Promise<boolean> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify({ propertyId }),
          });
          const data = await res.json();
          return data.success;
        } catch (e) {
          // fallback
        }
      }
      // Local fallback
      const favIds = JSON.parse(localStorage.getItem('daratelier_favorites') || '[]');
      if (!favIds.includes(propertyId)) {
        favIds.push(propertyId);
        localStorage.setItem('daratelier_favorites', JSON.stringify(favIds));
      }
      return true;
    },

    remove: async (propertyId: string): Promise<boolean> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/favorites/${propertyId}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
          });
          const data = await res.json();
          return data.success;
        } catch (e) {
          // fallback
        }
      }
      // Local fallback
      const favIds = JSON.parse(localStorage.getItem('daratelier_favorites') || '[]');
      const newIds = favIds.filter((id: string) => id !== propertyId);
      localStorage.setItem('daratelier_favorites', JSON.stringify(newIds));
      return true;
    },

    check: async (propertyId: string): Promise<boolean> => {
      const isOnline = await checkServerHealth();
      if (isOnline) {
        try {
          const res = await fetch(`${API_BASE}/favorites/check/${propertyId}`, {
            headers: getAuthHeader(),
          });
          const data = await res.json();
          return data.isFavorite;
        } catch (e) {
          // fallback
        }
      }
      // Local fallback
      const favIds = JSON.parse(localStorage.getItem('daratelier_favorites') || '[]');
      return favIds.includes(propertyId);
    },
  },
};
