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
  PropertyStatus,
} from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_CONSTRUCTION_PROJECTS,
  INITIAL_DESIGN_PROJECTS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_INQUIRIES,
  INITIAL_QUOTES,
  INITIAL_SETTINGS,
  INITIAL_ACTIVITY_LOGS,
} from './mockData';

const KEYS = {
  PROPERTIES: 'daratelier_properties',
  CONSTRUCTION: 'daratelier_construction',
  DESIGN: 'daratelier_design',
  REVIEWS: 'daratelier_reviews',
  USERS: 'daratelier_users',
  INQUIRIES: 'daratelier_inquiries',
  QUOTES: 'daratelier_quotes',
  SETTINGS: 'daratelier_settings',
  ACTIVITY: 'daratelier_activity',
  DEMO_MODE: 'daratelier_demo_mode',
};

// Helper for local storage
function getStorage<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to read ${key} from localStorage, using fallback:`, e);
    return initial;
  }
}

function setStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

function logActivity(action: string, entityType: string, details: string, userName: string = 'Administrateur') {
  const activities = getStorage<ActivityLog[]>(KEYS.ACTIVITY, INITIAL_ACTIVITY_LOGS);
  const newLog: ActivityLog = {
    id: `act-${Date.now()}`,
    userName,
    userRole: 'ADMIN',
    action,
    entityType,
    details,
    createdAt: new Date().toISOString(),
  };
  setStorage(KEYS.ACTIVITY, [newLog, ...activities.slice(0, 49)]);
}

export const LocalStore = {
  // Properties
  getProperties: (): Property[] => {
    return getStorage<Property[]>(KEYS.PROPERTIES, INITIAL_PROPERTIES);
  },

  getPropertyBySlug: (slug: string): Property | undefined => {
    const props = LocalStore.getProperties();
    return props.find((p) => p.slug === slug);
  },

  getPropertyById: (id: string): Property | undefined => {
    const props = LocalStore.getProperties();
    return props.find((p) => p.id === id);
  },

  createProperty: (data: Partial<Property>): Property => {
    const props = LocalStore.getProperties();
    const slugBase = (data.title || 'propriete')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: data.title || 'Nouvelle Propriété',
      slug,
      description: data.description || '',
      type: data.type || 'VILLA',
      transactionType: data.transactionType || 'BUY',
      price: data.price || 0,
      currency: data.currency || 'MAD',
      city: data.city || 'Casablanca',
      neighborhood: data.neighborhood || '',
      address: data.address || '',
      surfaceArea: data.surfaceArea || 0,
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      status: (data.status as PropertyStatus) || 'AVAILABLE',
      isFeatured: !!data.isFeatured,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      energyRating: data.energyRating || 'A',
      yearBuilt: data.yearBuilt || 2024,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: data.images && data.images.length > 0 ? data.images : [
        {
          id: `img-${Date.now()}`,
          url: data.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
          isCover: true,
          order: 0,
        }
      ],
      features: data.features || [],
    };

    setStorage(KEYS.PROPERTIES, [newProperty, ...props]);
    logActivity('PROPERTY_CREATED', 'Property', `Création du bien "${newProperty.title}" (${newProperty.city})`);
    return newProperty;
  },

  updateProperty: (id: string, updates: Partial<Property>): Property => {
    const props = LocalStore.getProperties();
    const index = props.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Propriété introuvable');

    const updated: Property = {
      ...props[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    props[index] = updated;
    setStorage(KEYS.PROPERTIES, props);
    logActivity('PROPERTY_UPDATED', 'Property', `Mise à jour du bien "${updated.title}"`);
    return updated;
  },

  deleteProperty: (id: string): void => {
    const props = LocalStore.getProperties();
    const target = props.find((p) => p.id === id);
    const filtered = props.filter((p) => p.id !== id);
    setStorage(KEYS.PROPERTIES, filtered);
    if (target) {
      logActivity('PROPERTY_DELETED', 'Property', `Suppression du bien "${target.title}"`);
    }
  },

  // Inquiries / Leads
  getInquiries: (): Inquiry[] => {
    return getStorage<Inquiry[]>(KEYS.INQUIRIES, INITIAL_INQUIRIES);
  },

  createInquiry: (data: Partial<Inquiry>): Inquiry => {
    const inquiries = LocalStore.getInquiries();
    const newInquiry: Inquiry = {
      id: `inq-${Date.now()}`,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle,
      propertySlug: data.propertySlug,
      propertyCoverImage: data.propertyCoverImage,
      subject: data.subject || 'Demande de renseignements',
      message: data.message || '',
      preferredContactMethod: data.preferredContactMethod || 'PHONE',
      source: data.propertyId ? 'PROPERTY_PAGE' : 'CONTACT_FORM',
      priority: data.priority || 'MEDIUM',
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
    };
    setStorage(KEYS.INQUIRIES, [newInquiry, ...inquiries]);
    logActivity('INQUIRY_RECEIVED', 'Inquiry', `Nouvelle demande reçue de ${newInquiry.name}`);
    return newInquiry;
  },

  updateInquiry: (id: string, updates: Partial<Inquiry>, newNote?: string): Inquiry => {
    const inquiries = LocalStore.getInquiries();
    const index = inquiries.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Inquiry introuvable');

    const current = inquiries[index];
    const notes = [...current.notes];
    if (newNote) {
      notes.unshift({
        id: `not-${Date.now()}`,
        inquiryId: id,
        authorId: 'u-1',
        authorName: 'Youssef El Amrani',
        content: newNote,
        createdAt: new Date().toISOString(),
      });
    }

    const updated: Inquiry = {
      ...current,
      ...updates,
      notes,
      updatedAt: new Date().toISOString(),
    };
    inquiries[index] = updated;
    setStorage(KEYS.INQUIRIES, inquiries);
    logActivity('INQUIRY_UPDATED', 'Inquiry', `Mise à jour du statut pour ${updated.name} -> ${updated.status}`);
    return updated;
  },

  // Quotes
  getQuotes: (): QuoteRequest[] => {
    return getStorage<QuoteRequest[]>(KEYS.QUOTES, INITIAL_QUOTES);
  },

  createQuote: (data: Partial<QuoteRequest>): QuoteRequest => {
    const quotes = LocalStore.getQuotes();
    const newQuote: QuoteRequest = {
      id: `q-${Date.now()}`,
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      city: data.city || 'Casablanca',
      projectType: data.projectType || 'VILLA_CONSTRUCTION',
      plotSize: data.plotSize,
      estimatedArea: data.estimatedArea,
      numberOfFloors: data.numberOfFloors,
      budgetRange: data.budgetRange,
      expectedStartDate: data.expectedStartDate,
      description: data.description || '',
      status: 'PENDING',
      attachments: data.attachments || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStorage(KEYS.QUOTES, [newQuote, ...quotes]);
    logActivity('QUOTE_REQUESTED', 'QuoteRequest', `Demande de devis (${newQuote.projectType}) par ${newQuote.fullName}`);
    return newQuote;
  },

  updateQuote: (id: string, updates: Partial<QuoteRequest>): QuoteRequest => {
    const quotes = LocalStore.getQuotes();
    const index = quotes.findIndex((q) => q.id === id);
    if (index === -1) throw new Error('Quote introuvable');

    const updated: QuoteRequest = {
      ...quotes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    quotes[index] = updated;
    setStorage(KEYS.QUOTES, quotes);
    logActivity('QUOTE_UPDATED', 'QuoteRequest', `Devis ${id} mis à jour -> ${updated.status}`);
    return updated;
  },

  // Construction Projects
  getConstructionProjects: (): ConstructionProject[] => {
    return getStorage<ConstructionProject[]>(KEYS.CONSTRUCTION, INITIAL_CONSTRUCTION_PROJECTS);
  },

  updateConstructionProject: (id: string, updates: Partial<ConstructionProject>): ConstructionProject => {
    const projects = LocalStore.getConstructionProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Projet introuvable');

    const updated: ConstructionProject = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    projects[index] = updated;
    setStorage(KEYS.CONSTRUCTION, projects);
    logActivity('CONSTRUCTION_UPDATED', 'ConstructionProject', `Mise à jour du projet "${updated.title}" (${updated.progressPercentage}%)`);
    return updated;
  },

  toggleMilestone: (projectId: string, milestoneId: string): ConstructionProject => {
    const projects = LocalStore.getConstructionProjects();
    const projIndex = projects.findIndex((p) => p.id === projectId);
    if (projIndex === -1) throw new Error('Projet introuvable');

    const proj = { ...projects[projIndex] };
    proj.milestones = proj.milestones.map((m) => {
      if (m.id === milestoneId) {
        const nextState = !m.isCompleted;
        return {
          ...m,
          isCompleted: nextState,
          completedDate: nextState ? new Date().toISOString() : null,
        };
      }
      return m;
    });

    // Recalculate progress %
    const completedCount = proj.milestones.filter((m) => m.isCompleted).length;
    if (proj.milestones.length > 0) {
      proj.progressPercentage = Math.round((completedCount / proj.milestones.length) * 100);
    }

    projects[projIndex] = proj;
    setStorage(KEYS.CONSTRUCTION, projects);
    logActivity('MILESTONE_TOGGLED', 'ConstructionProject', `Jalon modifié sur le projet "${proj.title}"`);
    return proj;
  },

  // Design Projects
  getDesignProjects: (): DesignProject[] => {
    return getStorage<DesignProject[]>(KEYS.DESIGN, INITIAL_DESIGN_PROJECTS);
  },

  createDesignProject: (data: Partial<DesignProject>): DesignProject => {
    const projects = LocalStore.getDesignProjects();
    const slugBase = (data.title || 'projet-design')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const slug = `${slugBase}-${Date.now().toString().slice(-4)}`;

    const newProject: DesignProject = {
      id: `dp-${Date.now()}`,
      title: data.title || 'Nouveau Projet Design',
      slug,
      category: data.category || 'LIVING_ROOM',
      location: data.location || 'Casablanca',
      surfaceArea: data.surfaceArea || 100,
      year: data.year || 2025,
      description: data.description || '',
      designApproach: data.designApproach || '',
      materials: data.materials || [],
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      galleryImages: data.galleryImages || [data.coverImage || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85'],
      isFeatured: !!data.isFeatured,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setStorage(KEYS.DESIGN, [newProject, ...projects]);
    logActivity('DESIGN_PROJECT_CREATED', 'DesignProject', `Création du projet design "${newProject.title}"`);
    return newProject;
  },

  updateDesignProject: (id: string, updates: Partial<DesignProject>): DesignProject => {
    const projects = LocalStore.getDesignProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Projet de design introuvable');

    const updated: DesignProject = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    projects[index] = updated;
    setStorage(KEYS.DESIGN, projects);
    logActivity('DESIGN_PROJECT_UPDATED', 'DesignProject', `Mise à jour du projet design "${updated.title}"`);
    return updated;
  },

  // Users
  getUsers: (): User[] => {
    return getStorage<User[]>(KEYS.USERS, INITIAL_USERS);
  },

  updateUser: (id: string, updates: Partial<User>): User => {
    const users = LocalStore.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('Utilisateur introuvable');

    const updated = { ...users[index], ...updates };
    users[index] = updated;
    setStorage(KEYS.USERS, users);
    logActivity('USER_UPDATED', 'User', `Profil/rôle mis à jour pour ${updated.name}`);
    return updated;
  },

  // Settings
  getSettings: (): CompanySettings => {
    return getStorage<CompanySettings>(KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  updateSettings: (updates: Partial<CompanySettings>): CompanySettings => {
    const current = LocalStore.getSettings();
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    setStorage(KEYS.SETTINGS, updated);
    logActivity('SETTINGS_UPDATED', 'CompanySettings', 'Mise à jour des coordonnées et configurations générales');
    return updated;
  },

  // Reviews
  getReviews: (): Review[] => {
    return getStorage<Review[]>(KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  // Activity
  getActivityLogs: (): ActivityLog[] => {
    return getStorage<ActivityLog[]>(KEYS.ACTIVITY, INITIAL_ACTIVITY_LOGS);
  },

  // Reset demo data
  resetDefaults: (): void => {
    setStorage(KEYS.PROPERTIES, INITIAL_PROPERTIES);
    setStorage(KEYS.CONSTRUCTION, INITIAL_CONSTRUCTION_PROJECTS);
    setStorage(KEYS.DESIGN, INITIAL_DESIGN_PROJECTS);
    setStorage(KEYS.REVIEWS, INITIAL_REVIEWS);
    setStorage(KEYS.USERS, INITIAL_USERS);
    setStorage(KEYS.INQUIRIES, INITIAL_INQUIRIES);
    setStorage(KEYS.QUOTES, INITIAL_QUOTES);
    setStorage(KEYS.SETTINGS, INITIAL_SETTINGS);
    setStorage(KEYS.ACTIVITY, INITIAL_ACTIVITY_LOGS);
  },
};
