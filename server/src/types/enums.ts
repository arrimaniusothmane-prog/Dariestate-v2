/**
 * SQLite stores enum-like values as validated strings.
 * These constants keep controllers and validation strongly typed without a
 * database-level enum (which Prisma's SQLite connector does not support).
 */

const values = <T extends string>(...items: T[]) => items;

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  AGENT: 'AGENT',
  CONSTRUCTION_MANAGER: 'CONSTRUCTION_MANAGER',
  INTERIOR_DESIGNER: 'INTERIOR_DESIGNER',
  SALES_REP: 'SALES_REP',
  CLIENT: 'CLIENT',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const PropertyType = {
  VILLA: 'VILLA',
  APARTMENT: 'APARTMENT',
  HOUSE: 'HOUSE',
  LAND: 'LAND',
  COMMERCIAL: 'COMMERCIAL',
  OFFICE: 'OFFICE',
  PENTHOUSE: 'PENTHOUSE',
  DUPLEX: 'DUPLEX',
} as const;
export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType];

export const TransactionType = {
  BUY: 'BUY',
  RENT: 'RENT',
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const PropertyStatus = {
  DRAFT: 'DRAFT',
  AVAILABLE: 'AVAILABLE',
  UNDER_OFFER: 'UNDER_OFFER',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  RENTED: 'RENTED',
} as const;
export type PropertyStatus = (typeof PropertyStatus)[keyof typeof PropertyStatus];

export const PropertyCondition = {
  NEW: 'NEW',
  EXCELLENT: 'EXCELLENT',
  GOOD: 'GOOD',
  TO_RENOVATE: 'TO_RENOVATE',
} as const;
export type PropertyCondition = (typeof PropertyCondition)[keyof typeof PropertyCondition];

export const InquiryStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  VISIT_SCHEDULED: 'VISIT_SCHEDULED',
  NEGOTIATION: 'NEGOTIATION',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
} as const;
export type InquiryStatus = (typeof InquiryStatus)[keyof typeof InquiryStatus];

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;
export type Priority = (typeof Priority)[keyof typeof Priority];

export const QuoteStatus = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  SITE_VISIT_REQUIRED: 'SITE_VISIT_REQUIRED',
  QUOTE_PREPARED: 'QUOTE_PREPARED',
  SENT_TO_CLIENT: 'SENT_TO_CLIENT',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
} as const;
export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export const ConstructionStatus = {
  PLANNING: 'PLANNING',
  PERMIT_ACQUIRED: 'PERMIT_ACQUIRED',
  FOUNDATION: 'FOUNDATION',
  STRUCTURE: 'STRUCTURE',
  FINISHING: 'FINISHING',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
} as const;
export type ConstructionStatus = (typeof ConstructionStatus)[keyof typeof ConstructionStatus];

export const DesignCategory = {
  LIVING_ROOM: 'LIVING_ROOM',
  KITCHEN: 'KITCHEN',
  BEDROOM: 'BEDROOM',
  BATHROOM: 'BATHROOM',
  OFFICE: 'OFFICE',
  OUTDOOR: 'OUTDOOR',
  CUSTOM_FURNITURE: 'CUSTOM_FURNITURE',
  FULL_VILLA: 'FULL_VILLA',
  RENOVATION: 'RENOVATION',
} as const;
export type DesignCategory = (typeof DesignCategory)[keyof typeof DesignCategory];

export const PROPERTY_TYPES = values(
  'VILLA',
  'APARTMENT',
  'HOUSE',
  'LAND',
  'COMMERCIAL',
  'OFFICE',
  'PENTHOUSE',
  'DUPLEX'
);
export const TRANSACTION_TYPES = values('BUY', 'RENT');
export const PROPERTY_STATUSES = values(
  'DRAFT',
  'AVAILABLE',
  'UNDER_OFFER',
  'RESERVED',
  'SOLD',
  'RENTED'
);
export const PROPERTY_CONDITIONS = values('NEW', 'EXCELLENT', 'GOOD', 'TO_RENOVATE');
export const AVAILABILITY_STATUSES = values(
  'AVAILABLE',
  'UNDER_OFFER',
  'RESERVED',
  'SOLD',
  'RENTED'
);
export const USER_ROLES = values(
  'SUPER_ADMIN',
  'ADMIN',
  'AGENT',
  'CONSTRUCTION_MANAGER',
  'INTERIOR_DESIGNER',
  'SALES_REP',
  'CLIENT'
);
export const INQUIRY_STATUSES = values(
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VISIT_SCHEDULED',
  'NEGOTIATION',
  'CONVERTED',
  'LOST'
);
export const PRIORITIES = values('LOW', 'MEDIUM', 'HIGH', 'URGENT');
export const QUOTE_STATUSES = values(
  'PENDING',
  'UNDER_REVIEW',
  'SITE_VISIT_REQUIRED',
  'QUOTE_PREPARED',
  'SENT_TO_CLIENT',
  'ACCEPTED',
  'REJECTED',
  'COMPLETED'
);
export const CONSTRUCTION_STATUSES = values(
  'PLANNING',
  'PERMIT_ACQUIRED',
  'FOUNDATION',
  'STRUCTURE',
  'FINISHING',
  'COMPLETED',
  'ON_HOLD'
);
export const DESIGN_CATEGORIES = values(
  'LIVING_ROOM',
  'KITCHEN',
  'BEDROOM',
  'BATHROOM',
  'OFFICE',
  'OUTDOOR',
  'CUSTOM_FURNITURE',
  'FULL_VILLA',
  'RENOVATION'
);
