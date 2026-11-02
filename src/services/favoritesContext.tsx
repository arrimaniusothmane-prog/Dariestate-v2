import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '../types';
import { LocalStore } from './storage';

interface FavoritesContextType {
  favoriteIds: string[];
  favorites: Property[];
  toggleFavorite: (property: Property) => boolean;
  isFavorite: (id: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('daratelier_favorites');
      return saved ? JSON.parse(saved) : ['prop-1', 'prop-3'];
    } catch {
      return ['prop-1', 'prop-3'];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('daratelier_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const allProps = LocalStore.getProperties();
  const favorites = allProps.filter((p) => favoriteIds.includes(p.id));

  const toggleFavorite = (property: Property): boolean => {
    const exists = favoriteIds.includes(property.id);
    let next: string[];
    if (exists) {
      next = favoriteIds.filter((id) => id !== property.id);
      setToastMessage(`"${property.title.slice(0, 30)}..." retiré des favoris`);
    } else {
      next = [...favoriteIds, property.id];
      setToastMessage(`"${property.title.slice(0, 30)}..." ajouté à vos favoris`);
    }
    setFavoriteIds(next);
    setTimeout(() => setToastMessage(null), 3500);
    return !exists;
  };

  const isFavorite = (id: string): boolean => favoriteIds.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: favoriteIds.length,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-ivory px-5 py-3 rounded-luxury shadow-luxury border border-beige/30 flex items-center gap-3 animate-fade-in text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-bronze animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
