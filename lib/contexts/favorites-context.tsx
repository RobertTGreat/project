'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Favorite, favoritesService } from '@/lib/services/favorites';

interface FavoritesContextType {
  favorites: Favorite[];
  isLoading: boolean;
  addFavorite: (testId: string) => Promise<void>;
  removeFavorite: (testId: string) => Promise<void>;
  isFavorited: (testId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ 
  children, 
  user 
}: { 
  children: React.ReactNode;
  user: User | null;
}) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const userFavorites = await favoritesService.getUserFavorites(user.id);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error refreshing favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, [user]);

  const addFavorite = async (testId: string) => {
    if (!user) return;

    try {
      const newFavorite = await favoritesService.addFavorite(user.id, testId);
      if (newFavorite) {
        setFavorites(prev => [newFavorite, ...prev]);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (testId: string) => {
    if (!user) return;

    try {
      const success = await favoritesService.removeFavorite(user.id, testId);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.test_id !== testId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const isFavorited = (testId: string) => {
    return favorites.some(fav => fav.test_id === testId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        addFavorite,
        removeFavorite,
        isFavorited,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 