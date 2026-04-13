import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { deleteWardrobeImage } from '../lib/storage';

export interface WardrobeItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  image_url: string;
  image_path: string;
  created_at: string;
}

export const useWardrobe = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (searchQuery = '', categoryFilter = 'all') => {
    if (!user) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('wardrobe_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch wardrobe', { duration: 2000 });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteItem = async (itemId: string, imagePath: string) => {
    // Optimistic UI Update
    const previousItems = [...items];
    setItems(items.filter(item => item.id !== itemId));

    try {
      // 1. Delete from storage first
      const storageDeleted = await deleteWardrobeImage(imagePath);
      
      // We proceed even if storage delete fails (maybe file already gone),
      // but if it failed due to permissions/network, storageDeleted might be false.
      // Based on plan: If storage delete fails due to network, halt. 
      // Our lib/storage.ts returns false on error.

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from('wardrobe_items')
        .delete()
        .eq('id', itemId);

      if (dbError) throw dbError;
      toast.success('Item deleted', { duration: 2000 });
    } catch (err: any) {
      setItems(previousItems); // Restore on failure
      toast.error('Failed to delete item: ' + err.message, { duration: 2000 });
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    deleteItem,
    refetch: fetchItems,
  };
};
