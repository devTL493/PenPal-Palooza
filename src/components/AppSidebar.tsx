
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
  PenTool
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

// Sample unread count - in a real app, this would come from context/state
const unreadCount = 1;

export function AppSidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { expanded } = useSidebarContext();

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

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-2 text-primary">
          <Mail className="h-6 w-6" />
          {expanded && <span className="font-serif text-xl tracking-tight">PenPal</span>}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
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
