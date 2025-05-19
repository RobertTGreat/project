'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { Favorite, favoritesService } from '@/lib/services/favorites';

interface FavoritesContextType {
  favorites: Favorite[];
  isLoading: boolean;
  addFavorite: (toolId: number) => Promise<void>;
  removeFavorite: (toolId: number) => Promise<void>;
  isFavorited: (toolId: number) => boolean;
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

  const addFavorite = async (toolId: number) => {
    if (!user) return;

    try {
      const newFavorite = await favoritesService.addFavorite(user.id, toolId);
      if (newFavorite) {
        setFavorites(prev => [newFavorite, ...prev]);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const removeFavorite = async (toolId: number) => {
    if (!user) return;

    try {
      const success = await favoritesService.removeFavorite(user.id, toolId);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.tool_id !== toolId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const isFavorited = (toolId: number) => {
    return favorites.some(fav => fav.tool_id === toolId);
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