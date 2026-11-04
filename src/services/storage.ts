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
  PropertyStatus,
  ConstructionStatus,
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
  INITIAL_MEDIA,
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
  MEDIA: 'daratelier_media',
  DEMO_MODE: 'daratelier_demo_mode',
  DATA_VERSION: 'daratelier_data_version',
};

/**
 * Bumping this value re-seeds the demo dataset once in browsers that already
 * cached an older version (for example before the new photo galleries existed).
 */
const DATA_VERSION = '2026-11-human-2';

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

function seedAllDefaults(): void {
  setStorage(KEYS.PROPERTIES, INITIAL_PROPERTIES);
  setStorage(KEYS.CONSTRUCTION, INITIAL_CONSTRUCTION_PROJECTS);
  setStorage(KEYS.DESIGN, INITIAL_DESIGN_PROJECTS);
  setStorage(KEYS.REVIEWS, INITIAL_REVIEWS);
  setStorage(KEYS.USERS, INITIAL_USERS);
  setStorage(KEYS.INQUIRIES, INITIAL_INQUIRIES);
  setStorage(KEYS.QUOTES, INITIAL_QUOTES);
  setStorage(KEYS.SETTINGS, INITIAL_SETTINGS);
  setStorage(KEYS.ACTIVITY, INITIAL_ACTIVITY_LOGS);
  setStorage(KEYS.MEDIA, INITIAL_MEDIA);
}

function ensureDataVersion(): void {
  try {
    const storedVersion = localStorage.getItem(KEYS.DATA_VERSION);
    if (storedVersion !== DATA_VERSION) {
      seedAllDefaults();
      localStorage.setItem(KEYS.DATA_VERSION, DATA_VERSION);
    }
  } catch (e) {
    // localStorage can be unavailable in private mode / tests: the getters below still seed on demand.
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
      reference: data.reference || `DAR-B-${new Date().getFullYear()}-${String(props.length + 1).padStart(4, '0')}`,
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
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      surfaceArea: data.surfaceArea || 0,
      landArea: data.landArea ?? null,
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      floors: data.floors || 0,
      garage: !!data.garage,
      garden: !!data.garden,
      swimmingPool: !!data.swimmingPool,
      terrace: !!data.terrace,
      furnished: !!data.furnished,
      condition: data.condition || 'NEW',
      constructionYear: data.constructionYear ?? data.yearBuilt ?? null,
      availability: data.availability || (data.status === 'DRAFT' ? 'AVAILABLE' : data.status) || 'AVAILABLE',
      status: (data.status as PropertyStatus) || 'DRAFT',
      isPublished: data.isPublished ?? false,
      isFeatured: !!data.isFeatured,
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
      videoUrl: data.videoUrl ?? null,
      energyRating: data.energyRating || 'A',
      yearBuilt: data.yearBuilt || 2024,
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
      publishedAt: data.publishedAt ?? null,
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

  createConstructionProject: (data: Partial<ConstructionProject>): ConstructionProject => {
    const projects = LocalStore.getConstructionProjects();
    const now = new Date().toISOString();
    const id = `cp-${Date.now()}`;

    const newProject: ConstructionProject = {
      id,
      title: data.title || 'Nouveau Chantier',
      clientName: data.clientName || 'Client privé',
      clientEmail: data.clientEmail || '',
      clientPhone: data.clientPhone || '',
      category: data.category || 'Villa Contemporaine',
      location: data.location || 'Casablanca',
      contractAmount: data.contractAmount || 0,
      currency: data.currency || 'MAD',
      startDate: data.startDate || now,
      expectedCompletionDate: data.expectedCompletionDate || now,
      status: (data.status as ConstructionStatus) || 'PLANNING',
      progressPercentage: data.progressPercentage || 0,
      projectManagerId: data.projectManagerId || 'u-3',
      projectManagerName: data.projectManagerName || 'Ing. Mehdi Bennani',
      coverImage: data.coverImage || INITIAL_MEDIA.find((m) => m.category === 'construction')?.url || INITIAL_MEDIA[0].url,
      description: data.description || '',
      milestones: (data.milestones || []).map((milestone, index) => ({
        ...milestone,
        id: milestone.id || `m-${Date.now()}-${index}`,
        projectId: id,
        order: milestone.order || index + 1,
        isCompleted: !!milestone.isCompleted,
      })),
      createdAt: now,
      updatedAt: now,
    };

    setStorage(KEYS.CONSTRUCTION, [newProject, ...projects]);
    logActivity('CONSTRUCTION_CREATED', 'ConstructionProject', `Création du chantier "${newProject.title}" (${newProject.location})`);
    return newProject;
  },

  deleteConstructionProject: (id: string): void => {
    const projects = LocalStore.getConstructionProjects();
    const target = projects.find((p) => p.id === id);
    setStorage(KEYS.CONSTRUCTION, projects.filter((p) => p.id !== id));
    if (target) {
      logActivity('CONSTRUCTION_DELETED', 'ConstructionProject', `Suppression du chantier "${target.title}"`);
    }
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

  deleteDesignProject: (id: string): void => {
    const projects = LocalStore.getDesignProjects();
    const target = projects.find((p) => p.id === id);
    setStorage(KEYS.DESIGN, projects.filter((p) => p.id !== id));
    if (target) {
      logActivity('DESIGN_PROJECT_DELETED', 'DesignProject', `Suppression du projet design "${target.title}"`);
    }
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

  createUser: (data: Partial<User>): User => {
    const users = LocalStore.getUsers();
    const email = (data.email || '').trim().toLowerCase();
    if (!email) throw new Error('Une adresse email est requise.');
    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error('Un compte existe déjà avec cette adresse email.');
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: data.name || 'Nouveau collaborateur',
      email,
      phone: data.phone || null,
      role: data.role || 'CLIENT',
      avatar: data.avatar || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      isEmailVerified: data.isEmailVerified ?? true,
      createdAt: new Date().toISOString(),
    };

    setStorage(KEYS.USERS, [...users, newUser]);
    logActivity('USER_CREATED', 'User', `Création du compte ${newUser.name} (${newUser.role})`);
    return newUser;
  },

  deleteUser: (id: string): void => {
    const users = LocalStore.getUsers();
    const target = users.find((u) => u.id === id);
    if (!target) return;
    if (target.role === 'SUPER_ADMIN') {
      throw new Error('Le compte Super Admin ne peut pas être supprimé.');
    }
    setStorage(KEYS.USERS, users.filter((u) => u.id !== id));
    logActivity('USER_DELETED', 'User', `Suppression du compte ${target.name}`);
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

  createReview: (data: Partial<Review>): Review => {
    const reviews = LocalStore.getReviews();
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      clientName: data.clientName || 'Client DAR & ATELIER',
      clientRole: data.clientRole || null,
      avatarUrl: data.avatarUrl || null,
      rating: data.rating || 5,
      comment: data.comment || '',
      projectType: data.projectType || null,
      isVerified: data.isVerified !== undefined ? data.isVerified : true,
      isPublished: data.isPublished !== undefined ? data.isPublished : true,
      createdAt: new Date().toISOString(),
    };
    setStorage(KEYS.REVIEWS, [newReview, ...reviews]);
    logActivity('REVIEW_CREATED', 'Review', `Nouveau témoignage ajouté pour ${newReview.clientName}`);
    return newReview;
  },

  updateReview: (id: string, updates: Partial<Review>): Review => {
    const reviews = LocalStore.getReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Témoignage introuvable');

    const updated: Review = { ...reviews[index], ...updates };
    reviews[index] = updated;
    setStorage(KEYS.REVIEWS, reviews);
    logActivity('REVIEW_UPDATED', 'Review', `Mise à jour du témoignage de ${updated.clientName}`);
    return updated;
  },

  deleteReview: (id: string): void => {
    const reviews = LocalStore.getReviews();
    const target = reviews.find((r) => r.id === id);
    setStorage(KEYS.REVIEWS, reviews.filter((r) => r.id !== id));
    if (target) {
      logActivity('REVIEW_DELETED', 'Review', `Suppression du témoignage de ${target.clientName}`);
    }
  },

  // Media library
  getMedia: (): MediaAsset[] => {
    return getStorage<MediaAsset[]>(KEYS.MEDIA, INITIAL_MEDIA);
  },

  addMedia: (data: Partial<MediaAsset>): MediaAsset => {
    const media = LocalStore.getMedia();
    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      url: data.url || '',
      filename: data.filename || `image-${Date.now()}.jpg`,
      altText: data.altText || 'Photographie architecturale DAR & ATELIER',
      category: data.category || 'general',
      dimensions: data.dimensions || '1920 x 1080',
      sizeKb: data.sizeKb || 0,
      uploadedAt: new Date().toISOString(),
    };
    setStorage(KEYS.MEDIA, [newAsset, ...media]);
    logActivity('MEDIA_ADDED', 'MediaAsset', `Ajout du visuel "${newAsset.filename}"`);
    return newAsset;
  },

  deleteMedia: (id: string): void => {
    const media = LocalStore.getMedia();
    const target = media.find((m) => m.id === id);
    setStorage(KEYS.MEDIA, media.filter((m) => m.id !== id));
    if (target) {
      logActivity('MEDIA_DELETED', 'MediaAsset', `Suppression du visuel "${target.filename}"`);
    }
  },

  // Activity
  getActivityLogs: (): ActivityLog[] => {
    return getStorage<ActivityLog[]>(KEYS.ACTIVITY, INITIAL_ACTIVITY_LOGS);
  },

  // Reset demo data
  resetDefaults: (): void => {
    seedAllDefaults();
    try {
      localStorage.setItem(KEYS.DATA_VERSION, DATA_VERSION);
    } catch (e) {
      // ignore
    }
  },
};

// Re-seed once if the stored demo dataset predates the current version.
ensureDataVersion();
