import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property } from '../types';
import { LocalStore } from './storage';
import { api } from './api';
import { useAuth } from './authContext';

interface FavoritesContextType {
  favoriteIds: string[];
  favorites: Property[];
  toggleFavorite: (property: Property) => Promise<boolean>;
  isFavorite: (id: string) => boolean;
  favoritesCount: number;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('daratelier_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('daratelier_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          const favs = await api.favorites.getAll();
          setFavorites(favs);
          setFavoriteIds(favs.map(f => f.id));
        } catch (e) {
          console.error('Failed to load favorites:', e);
          // Fallback to localStorage
          const allProps = LocalStore.getProperties();
          const localFavs = allProps.filter((p) => favoriteIds.includes(p.id));
          setFavorites(localFavs);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Not authenticated, use localStorage
        const allProps = LocalStore.getProperties();
        const localFavs = allProps.filter((p) => favoriteIds.includes(p.id));
        setFavorites(localFavs);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  const toggleFavorite = async (property: Property): Promise<boolean> => {
    const exists = favoriteIds.includes(property.id);
    let success = false;

    if (isAuthenticated) {
      try {
        if (exists) {
          success = await api.favorites.remove(property.id);
        } else {
          success = await api.favorites.add(property.id);
        }
      } catch (e) {
        console.error('Failed to toggle favorite:', e);
        success = false;
      }
    } else {
      // Local fallback for unauthenticated users
      success = true;
    }

    if (success) {
      let next: string[];
      if (exists) {
        next = favoriteIds.filter((id) => id !== property.id);
        setToastMessage(`"${property.title.slice(0, 30)}..." retiré des favoris`);
      } else {
        next = [...favoriteIds, property.id];
        setToastMessage(`"${property.title.slice(0, 30)}..." ajouté à vos favoris`);
      }
      setFavoriteIds(next);

      if (exists) {
        setFavorites(favorites.filter(f => f.id !== property.id));
      } else {
        setFavorites([...favorites, property]);
      }

      setTimeout(() => setToastMessage(null), 3500);
    }

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
        favoritesCount: favorites.length,
        isLoading,
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
