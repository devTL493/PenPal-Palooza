
import { 
  Link, 
  useLocation 
} from 'react-router-dom';
import { 
  Inbox, 
  User, 
  Users, 
  Home, 
  Mail, 
  LogOut, 
  PenTool,
  Settings,
  UserPlus
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebarContext
} from "@/components/ui/sidebar";
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function AppSidebar() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { expanded } = useSidebarContext();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) {
        setUnreadCount(0);
        return;
      }
      
      try {
        const { count, error } = await supabase
          .from('letters')
          .select('*', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('is_read', false);
          
        if (error) throw error;
        setUnreadCount(count || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };
    
    fetchUnreadCount();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('public:letters')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'letters', filter: `recipient_id=eq.${user?.id}` },
        () => fetchUnreadCount()
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'letters', filter: `recipient_id=eq.${user?.id}` },
        () => fetchUnreadCount()
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Define navigation items based on auth status
  const navItems = user ? [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { 
      name: 'Inbox', 
      path: '/dashboard', 
      icon: <div className="relative">
              <Inbox className="h-4 w-4" />
              {unreadCount > 0 && expanded && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
            </div> 
    },
    { name: 'Compose', path: '/compose', icon: <PenTool className="h-4 w-4" /> },
    { name: 'Pen Pals', path: '/penpals', icon: <Users className="h-4 w-4" /> },
    { name: 'Profile', path: '/profile', icon: <User className="h-4 w-4" /> },
  ] : [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
  ];

  // Handle sign out
  const handleSignOut = async () => {
    await signOut();
  };

  const getUserInitial = () => {
    if (profile?.full_name) {
      return profile.full_name.charAt(0).toUpperCase();
    } else if (profile?.username) {
      return profile.username.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-2 text-primary">
          <Mail className="h-6 w-6" />
          {expanded && <span className="font-serif text-xl tracking-tight">PenPal</span>}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        {user && expanded && (
          <div className="mb-6 px-2 py-1.5">
            <div className="flex items-center space-x-2">
              <Avatar className="h-9 w-9">
                {profile?.avatar_url && (
                  <AvatarImage src={profile.avatar_url} alt={profile.username || "User"} />
                )}
                <AvatarFallback>{getUserInitial()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{profile?.full_name || profile?.username || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{profile?.username || user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        <SidebarGroup>
          {expanded && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem 
                  key={item.name}
                  active={location.pathname === item.path}
                >
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className={cn(
                      "flex items-center",
                      expanded ? "justify-start space-x-3" : "justify-center"
                    )}>
                      {item.icon}
                      {expanded && (
                        <>
                          <span>{item.name}</span>
                          {item.name === 'Inbox' && unreadCount > 0 && (
                            <span className="ml-auto flex items-center justify-center bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem]">
                              {unreadCount}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {!user && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/auth" className={cn(
                      "flex items-center",
                      expanded ? "justify-start space-x-3" : "justify-center"
                    )}>
                      <UserPlus className="h-4 w-4" />
                      {expanded && <span>Sign In</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        {user ? (
          <button
            onClick={handleSignOut}
            className={cn(
              "flex items-center text-sidebar-foreground hover:text-sidebar-foreground/80 rounded-md transition-colors",
              expanded ? "justify-start space-x-2 w-full px-2 py-1.5" : "justify-center w-10 h-10"
            )}
          >
            <LogOut className="h-4 w-4" />
            {expanded && <span>Sign Out</span>}
          </button>
        ) : (
          <Link 
            to="/auth"
            className={cn(
              "flex items-center text-sidebar-foreground hover:text-sidebar-foreground/80 rounded-md transition-colors",
              expanded ? "justify-start space-x-2 w-full px-2 py-1.5" : "justify-center w-10 h-10"
            )}
          >
            <User className="h-4 w-4" />
            {expanded && <span>Sign In</span>}
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
