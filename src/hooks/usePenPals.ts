
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type PenPal = {
  id: string;
  name?: string;
  username: string;
  avatar?: string;
  location?: string;
  interests: string[];
  letterCount: number;
  isConnected: boolean;
  connectionId?: string;
  connectionStatus?: 'pending' | 'accepted' | 'declined';
};

export const usePenPals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [penPals, setPenPals] = useState<PenPal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPenPals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch all profiles except the current user
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id, 
          username, 
          full_name, 
          avatar_url, 
          location
        `)
        .neq('id', user.id);
        
      if (profilesError) throw profilesError;

      // Get connections
      const { data: connections, error: connectionsError } = await supabase
        .from('pen_pal_connections')
        .select('id, pen_pal_id, status')
        .eq('user_id', user.id);
        
      if (connectionsError) throw connectionsError;
      
      // Get all interests for all profiles
      const { data: userInterests, error: interestsError } = await supabase
        .from('user_interests')
        .select(`
          user_id,
          interests (
            name
          )
        `);
      
      if (interestsError) throw interestsError;
      
      // Get letter counts
      const { data: letters, error: lettersError } = await supabase
        .from('letters')
        .select('sender_id, recipient_id')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
        
      if (lettersError) throw lettersError;
      
      // Map to PenPal format
      const mappedPenPals = profiles?.map(profile => {
        // Find connection with this pen pal
        const connection = connections?.find(c => c.pen_pal_id === profile.id);
        
        // Get interests for this profile
        const profileInterests = userInterests
          ?.filter(ui => ui.user_id === profile.id)
          ?.map(ui => ui.interests.name) || [];
          
        // Count letters with this pen pal
        const letterCount = letters?.filter(l => 
          (l.sender_id === user.id && l.recipient_id === profile.id) || 
          (l.sender_id === profile.id && l.recipient_id === user.id)
        )?.length || 0;
        
        return {
          id: profile.id,
          name: profile.full_name || profile.username,
          username: profile.username,
          avatar: profile.avatar_url || undefined,
          location: profile.location || undefined,
          interests: profileInterests,
          letterCount,
          isConnected: connection?.status === 'accepted',
          connectionId: connection?.id,
          connectionStatus: connection?.status as 'pending' | 'accepted' | 'declined' | undefined
        };
      }) || [];
      
      setPenPals(mappedPenPals);
    } catch (err) {
      console.error('Error fetching pen pals:', err);
      setError(err.message || 'Failed to load pen pals');
    } finally {
      setLoading(false);
    }
  };

  const connectWithPenPal = async (penPalId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pen_pal_connections')
        .insert({
          user_id: user.id,
          pen_pal_id: penPalId,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update local state
      setPenPals(prevPenPals => 
        prevPenPals.map(penPal => 
          penPal.id === penPalId 
            ? { 
                ...penPal, 
                connectionId: data.id,
                connectionStatus: 'pending'
              } 
            : penPal
        )
      );
      
      toast({
        title: "Connection request sent",
        description: "We'll notify you when they respond",
      });
      
      return data;
    } catch (err) {
      console.error('Error connecting with pen pal:', err);
      toast({
        title: "Connection failed", 
        description: err.message || "Couldn't send connection request",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchPenPals();
    } else {
      setPenPals([]);
    }
  }, [user]);

  return {
    penPals,
    loading,
    error,
    connectWithPenPal,
    refresh: fetchPenPals
  };
};
