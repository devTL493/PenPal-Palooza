
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [session, setSession] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) navigate('/dashboard');
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) navigate('/dashboard');
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !fullName) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email for verification instructions.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter your email and password.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Invalid login credentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-paper-light to-paper texture px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-paper-light to-background z-[-1]" />
      
      <div className="flex items-center space-x-2 mb-6">
        <Mail className="h-6 w-6 text-primary" />
        <span className="font-serif text-2xl tracking-tight">PenPal</span>
      </div>
      
      <Card className="w-full max-w-md paper">
        <CardHeader>
          <CardTitle className="text-center font-serif text-3xl">Welcome</CardTitle>
          <CardDescription className="text-center">
            Sign in to access your letters and connections
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center border rounded-md overflow-hidden bg-background">
                    <Mail className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center border rounded-md overflow-hidden bg-background">
                    <Lock className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="flex items-center border rounded-md overflow-hidden bg-background">
                    <User className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="fullName" 
                      type="text" 
                      placeholder="John Doe" 
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="flex items-center border rounded-md overflow-hidden bg-background">
                    <Mail className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="you@example.com" 
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="flex items-center border rounded-md overflow-hidden bg-background">
                    <Lock className="ml-2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing up...' : 'Create Account'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="mt-6 text-sm text-muted-foreground text-center">
        <p>By signing in or creating an account, you agree to our</p>
        <p>Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default Auth;
