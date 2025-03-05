import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Inbox, 
  User, 
  Menu, 
  Users, 
  Home,
  X,
  Mail
} from 'lucide-react';

// Sample unread count - in a real app, this would come from context/state
const unreadCount = 1;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll events to apply styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { 
      name: 'Inbox', 
      path: '/dashboard', 
      icon: <div className="relative">
              <Inbox className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </div> 
    },
    { name: 'Pen Pals', path: '/penpals', icon: <Users className="h-4 w-4" /> },
    { name: 'Profile', path: '/profile', icon: <User className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-background/80 backdrop-blur-sm shadow-sm p-2 rounded-full transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Desktop Navigation */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-40 hidden md:block transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-sm shadow-sm" : "bg-transparent"
      )}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary animate-paper-float">
            <Mail className="h-6 w-6" />
            <span className="font-serif text-xl tracking-tight">PenPal</span>
          </Link>
          
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-300",
                  location.pathname === item.path 
                    ? "text-foreground bg-accent" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <span className="flex items-center space-x-1.5">
                  {item.icon}
                  <span>{item.name}</span>
                  {item.name === 'Inbox' && unreadCount > 0 && (
                    <span className="ml-1 flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem]">
                      {unreadCount}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-md z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Navigation Menu */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 w-64 bg-card shadow-xl z-50 p-6 transform transition-transform duration-300 ease-spring md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-8">
            <Mail className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl tracking-tight">PenPal</span>
          </div>
          
          <nav className="flex flex-col space-y-1 flex-1">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className={cn(
                  "px-4 py-3 rounded-md text-sm font-medium transition-all duration-200",
                  location.pathname === item.path 
                    ? "text-foreground bg-accent" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <span className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                  {item.name === 'Inbox' && unreadCount > 0 && (
                    <span className="ml-1 flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem]">
                      {unreadCount}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </nav>
          
          <div className="pt-6 border-t border-border">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4 mr-2" /> Close Menu
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
