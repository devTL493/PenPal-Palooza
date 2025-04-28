import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PenPalCard from '@/components/PenPalCard';
import Navigation from '@/components/Navigation';
import {
  Search,
  Users,
  Filter,
  ArrowDownAZ,
  ArrowUpAZ,
  Loader2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { usePenPals } from '@/hooks/usePenPals';
import { useAuth } from '@/contexts/AuthContext';
import FloatingComposeButton from '@/components/letter/FloatingComposeButton';

const PenPals = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { penPals, loading, error, connectWithPenPal } = usePenPals();
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  // Filter and sort pen pals
  const filteredAndSortedPenPals = [...penPals]
    .filter(penpal => 
      penpal.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      penpal.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      penpal.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      penpal.interests.some(interest => 
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      const nameA = a.name || a.username;
      const nameB = b.name || b.username;
      
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  
  const handleConnect = async (penPalId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to connect with pen pals",
      });
      return;
    }
    
    const penPal = penPals.find(pp => pp.id === penPalId);
    
    // If already connected, let's write a letter
    if (penPal?.isConnected) {
      toast({
        description: `Writing a letter to ${penPal.name}`,
      });
      return;
    }
    
    // Otherwise, send connection request
    await connectWithPenPal(penPalId);
  };
  
  const handleViewProfile = (penPalId: string) => {
    console.log(`Viewing profile of pen pal ${penPalId}`);
    // In a real app, this would navigate to the pen pal's profile
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-serif font-medium">Find Pen Pals</h1>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={toggleSortOrder}>
                {sortOrder === 'asc' ? (
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                ) : (
                  <ArrowUpAZ className="mr-2 h-4 w-4" />
                )}
                Sort
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              className="pl-10"
              placeholder="Search by name, location, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
              <p className="mt-4 text-lg font-medium">Loading pen pals...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive">{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : filteredAndSortedPenPals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedPenPals.map((penpal) => (
                <PenPalCard
                  key={penpal.id}
                  {...penpal}
                  onClick={() => handleViewProfile(penpal.id)}
                  onConnect={() => handleConnect(penpal.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-xl font-medium">No pen pals found</h3>
              <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                {searchQuery 
                  ? "We couldn't find any pen pals matching your search. Try adjusting your search criteria."
                  : "There are no other users registered yet. Be the first to invite your friends!"}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <FloatingComposeButton />
    </div>
  );
};

export default PenPals;
