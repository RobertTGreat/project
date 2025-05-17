import { createClient } from '@/lib/supabase/client';

export interface Favorite {
  id: number;
  user_id: string;
  test_id: string;
  created_at: string;
}

export const favoritesService = {
  // Get user's favorites
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }

    return data || [];
  },

  // Add a favorite
  async addFavorite(userId: string, testId: string): Promise<Favorite | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, test_id: testId }])
      .select()
      .single();

    if (error) {
      console.error('Error adding favorite:', error);
      return null;
    }

    return data;
  },

  // Remove a favorite
  async removeFavorite(userId: string, testId: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('test_id', testId);

    if (error) {
      console.error('Error removing favorite:', error);
      return false;
    }

    return true;
  },

  // Check if a test is favorited
  async isFavorited(userId: string, testId: string): Promise<boolean> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('test_id', testId)
      .single();

    if (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }

    return !!data;
  }
}; 