export type Language = 'fr' | 'ar' | 'en';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'AGENT'
  | 'CONSTRUCTION_MANAGER'
  | 'INTERIOR_DESIGNER'
  | 'SALES_REP'
  | 'CLIENT';

export type PropertyType =
  | 'VILLA'
  | 'APARTMENT'
  | 'HOUSE'
  | 'LAND'
  | 'COMMERCIAL'
  | 'OFFICE'
  | 'PENTHOUSE'
  | 'DUPLEX';

export type TransactionType = 'BUY' | 'RENT';

export type PropertyStatus =
  | 'DRAFT'
  | 'AVAILABLE'
  | 'UNDER_OFFER'
  | 'RESERVED'
  | 'SOLD'
  | 'RENTED';

export type InquiryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'VISIT_SCHEDULED'
  | 'NEGOTIATION'
  | 'CONVERTED'
  | 'LOST';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type QuoteStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'SITE_VISIT_REQUIRED'
  | 'QUOTE_PREPARED'
  | 'SENT_TO_CLIENT'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'COMPLETED';

export type ConstructionStatus =
  | 'PLANNING'
  | 'PERMIT_ACQUIRED'
  | 'FOUNDATION'
  | 'STRUCTURE'
  | 'FINISHING'
  | 'COMPLETED'
  | 'ON_HOLD';

export type DesignCategory =
  | 'ALL'
  | 'LIVING_ROOM'
  | 'KITCHEN'
  | 'BEDROOM'
  | 'BATHROOM'
  | 'OFFICE'
  | 'OUTDOOR'
  | 'CUSTOM_FURNITURE'
  | 'FULL_VILLA'
  | 'RENOVATION';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  avatar?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

export type PropertyCondition = 'NEW' | 'EXCELLENT' | 'GOOD' | 'TO_RENOVATE';

export interface PropertyImage {
  id: string;
  url: string;
  alt?: string | null;
  caption?: string | null;
  order: number;
  isCover: boolean;
}

export interface PropertyFeature {
  id: string;
  name: string;
  category?: string | null;
}

export interface Property {
  id: string;
  reference?: string;
  title: string;
  slug: string;
  description: string;
  type: PropertyType;
  transactionType: TransactionType;
  price: number;
  currency: string;
  city: string;
  neighborhood: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  surfaceArea: number;
  landArea?: number | null;
  bedrooms: number;
  bathrooms: number;
  floors?: number;
  garage?: boolean;
  garden?: boolean;
  swimmingPool?: boolean;
  terrace?: boolean;
  furnished?: boolean;
  condition?: PropertyCondition;
  constructionYear?: number | null;
  availability?: PropertyStatus;
  status: PropertyStatus;
  isPublished?: boolean;
  isFeatured: boolean;
  coverImage: string;
  videoUrl?: string | null;
  energyRating?: string | null;
  yearBuilt?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  images: PropertyImage[];
  features: PropertyFeature[];
}

export interface InquiryNote {
  id: string;
  inquiryId: string;
  authorId: string;
  authorName?: string;
  content: string;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string | null;
  propertyTitle?: string | null;
  propertySlug?: string | null;
  propertyCoverImage?: string | null;
  subject: string;
  message: string;
  preferredContactMethod: 'PHONE' | 'EMAIL' | 'WHATSAPP';
  source: string;
  priority: Priority;
  status: InquiryStatus;
  assignedToId?: string | null;
  assignedToName?: string | null;
  followUpDate?: string | null;
  createdAt: string;
  updatedAt: string;
  notes: InquiryNote[];
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  projectType: string;
  plotSize?: number | null;
  estimatedArea?: number | null;
  numberOfFloors?: number | null;
  budgetRange?: string | null;
  expectedStartDate?: string | null;
  description: string;
  status: QuoteStatus;
  proposedPrice?: number | null;
  assignedToId?: string | null;
  assignedToName?: string | null;
  internalNotes?: string | null;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ConstructionMilestone {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  targetDate: string;
  completedDate?: string | null;
  isCompleted: boolean;
  order: number;
}

export interface ConstructionProject {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  category: string;
  location: string;
  contractAmount: number;
  currency: string;
  startDate: string;
  expectedCompletionDate: string;
  status: ConstructionStatus;
  progressPercentage: number;
  projectManagerId?: string | null;
  projectManagerName?: string | null;
  coverImage: string;
  description: string;
  milestones: ConstructionMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface DesignProject {
  id: string;
  title: string;
  slug: string;
  category: DesignCategory;
  location?: string | null;
  surfaceArea?: number | null;
  year: number;
  description: string;
  designApproach: string;
  materials: string[];
  coverImage: string;
  galleryImages: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  clientName: string;
  clientRole?: string | null;
  avatarUrl?: string | null;
  rating: number;
  comment: string;
  projectType?: string | null;
  isVerified: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  altText: string;
  category: 'property' | 'construction' | 'design' | 'general';
  dimensions: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface ActivityLog {
  id: string;
  userId?: string | null;
  userName?: string | null;
  userRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: string | null;
  createdAt: string;
}

export interface CompanySettings {
  id: string;
  companyName: string;
  logoUrl?: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  defaultCurrency: string;
  defaultLanguage: Language;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  metaTitle: string;
  metaDescription: string;
  emailNotificationsEnabled: boolean;
  updatedAt: string;
}

export interface FilterState {
  search: string;
  transactionType: 'ALL' | 'BUY' | 'RENT';
  type: string;
  city: string;
  neighborhood: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | '';
  bathrooms: number | '';
  minSurface: number | '';
  sort: 'newest' | 'priceAsc' | 'priceDesc' | 'surfaceDesc';
}
