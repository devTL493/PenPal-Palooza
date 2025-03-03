
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Sample pen pal data
const samplePenPals = [
  {
    id: '1',
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop',
    location: 'Tokyo, Japan',
    interests: ['Literature', 'Travel', 'Art'],
    letterCount: 5,
    isConnected: true,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    location: 'London, UK',
    interests: ['Philosophy', 'History', 'Music'],
    letterCount: 3,
    isConnected: true,
  },
  {
    id: '3',
    name: 'Sophia Williams',
    location: 'Paris, France',
    interests: ['Fashion', 'Photography', 'Cooking'],
    letterCount: 0,
    isConnected: false,
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&auto=format&fit=crop',
    location: 'Melbourne, Australia',
    interests: ['Nature', 'Travel', 'Technology'],
    letterCount: 0,
    isConnected: false,
  },
  {
    id: '5',
    name: 'Olivia Brown',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&auto=format&fit=crop',
    location: 'Berlin, Germany',
    interests: ['Music', 'Architecture', 'Films'],
    letterCount: 0,
    isConnected: false,
  },
];

const PenPals = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [penPals, setPenPals] = useState(samplePenPals);
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  // Filter and sort pen pals
  const filteredAndSortedPenPals = [...penPals]
    .filter(penpal => 
      penpal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      penpal.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      penpal.interests.some(interest => 
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  
  const handleConnect = (penPalId: string) => {
    setPenPals(penPals.map(penpal => 
      penpal.id === penPalId 
        ? {...penpal, isConnected: !penpal.isConnected} 
        : penpal
    ));

    const penPal = penPals.find(pp => pp.id === penPalId);
    if (penPal) {
      if (!penPal.isConnected) {
        toast({
          title: `Connected with ${penPal.name}`,
          description: "You can now exchange letters with this pen pal.",
        });
      } else {
        toast({
          description: `Writing a letter to ${penPal.name}`,
        });
      }
    }
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
          
          {filteredAndSortedPenPals.length > 0 ? (
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
                We couldn't find any pen pals matching your search. Try adjusting your search criteria.
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
    </div>
  );
};

export default PenPals;
