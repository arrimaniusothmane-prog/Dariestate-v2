import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStore } from '../services/storage';

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

describe('Property Management & Filtering Service', () => {
  beforeEach(() => {
    global.localStorage.clear();
  });

  it('loads initial properties catalogue successfully', () => {
    const properties = LocalStore.getProperties();
    expect(properties).toBeDefined();
    expect(properties.length).toBeGreaterThanOrEqual(1);

    const first = properties[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('title');
    expect(first).toHaveProperty('price');
    expect(first).toHaveProperty('city');
    expect(first).toHaveProperty('slug');
  });

  it('retrieves a property by slug', () => {
    const properties = LocalStore.getProperties();
    const target = properties[0];
    const found = LocalStore.getPropertyBySlug(target.slug);

    expect(found).toBeDefined();
    expect(found?.id).toBe(target.id);
    expect(found?.title).toBe(target.title);
  });

  it('creates and persists a new luxury villa property', () => {
    const newProperty = LocalStore.createProperty({
      title: 'Villa Océane Test',
      city: 'Casablanca',
      type: 'VILLA',
      transactionType: 'BUY',
      price: 18500000,
      surfaceArea: 650,
      bedrooms: 5,
      bathrooms: 6,
    });

    expect(newProperty.id).toBeDefined();
    expect(newProperty.slug).toContain('villa-oceane-test');
    expect(newProperty.price).toBe(18500000);

    const reloaded = LocalStore.getPropertyById(newProperty.id);
    expect(reloaded).toBeDefined();
    expect(reloaded?.city).toBe('Casablanca');
  });

  it('updates property status and details', () => {
    const properties = LocalStore.getProperties();
    const target = properties[0];

    const updated = LocalStore.updateProperty(target.id, {
      status: 'RESERVED',
      price: target.price + 100000,
    });

    expect(updated.status).toBe('RESERVED');
    expect(updated.price).toBe(target.price + 100000);
  });
});
