
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import Navigation from '@/components/Navigation';
import { 
  User, 
  Settings, 
  Mail, 
  MapPin, 
  Plus, 
  X, 
  Save 
} from 'lucide-react';

const Profile = () => {
  const { toast } = useToast();
  const [name, setName] = useState('Alex Morgan');
  const [location, setLocation] = useState('San Francisco, CA');
  const [bio, setBio] = useState('Passionate about literature, travel, and connecting with people through meaningful correspondence.');
  const [interests, setInterests] = useState(['Literature', 'Travel', 'Photography', 'History']);
  const [newInterest, setNewInterest] = useState('');
  const [avatar, setAvatar] = useState('/placeholder.svg');
  
  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };
  
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback className="text-lg">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-3xl font-serif font-medium">{name}</h1>
                {location && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                12 Letters
              </Button>
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <Card className="paper">
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="resize-none min-h-[100px]"
                    placeholder="Tell potential pen pals about yourself..."
                  />
                </CardContent>
              </Card>
              
              <Card className="paper">
                <CardHeader>
                  <CardTitle>Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {interests.map((interest, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="flex items-center gap-1 py-1.5"
                      >
                        {interest}
                        <button 
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-1 hover:text-destructive focus:outline-none"
                          aria-label={`Remove ${interest}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      placeholder="Add a new interest"
                      className="max-w-xs"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleAddInterest}
                      disabled={!newInterest.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="paper">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">
                      Location
                    </label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card className="paper">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Account settings will be available in the next update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
