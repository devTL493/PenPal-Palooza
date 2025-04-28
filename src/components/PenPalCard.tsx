
import React from 'react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Mail, 
  User,
  Check,
  Clock,
  X
} from 'lucide-react';

export interface PenPalCardProps {
  id: string;
  name?: string;
  username: string;
  avatar?: string;
  location?: string;
  interests: string[];
  letterCount?: number;
  isConnected?: boolean;
  connectionStatus?: 'pending' | 'accepted' | 'declined';
  onClick?: () => void;
  onConnect?: () => void;
  className?: string;
}

const PenPalCard: React.FC<PenPalCardProps> = ({
  id,
  name,
  username,
  avatar,
  location,
  interests,
  letterCount = 0,
  isConnected = false,
  connectionStatus,
  onClick,
  onConnect,
  className,
}) => {
  const displayName = name || username;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card 
        className={cn(
          "paper w-full overflow-hidden transition-all duration-300 hover:translate-y-[-2px]",
          className
        )}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {avatar ? (
                <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border shadow-sm">
                  <img 
                    src={avatar} 
                    alt={displayName}
                    className="object-cover w-full h-full"
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.parentElement?.classList.remove('image-loading')}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div>
                <h3 className="font-serif font-medium text-foreground">{displayName}</h3>
                <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                  {username && (
                    <span className="mr-2">@{username}</span>
                  )}
                  {location && (
                    <>
                      <MapPin className="h-3 w-3 mr-1" aria-hidden="true" />
                      <span>{location}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {letterCount > 0 && (
              <Badge variant="outline" className="text-xs">
                <Mail className="h-3 w-3 mr-1" />
                {letterCount} letter{letterCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1.5">
            {interests.map((interest, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={onClick}
            >
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            
            {connectionStatus === 'pending' ? (
              <Button 
                size="sm" 
                variant="secondary"
                className="w-full"
                disabled
              >
                <Clock className="h-4 w-4 mr-2" />
                Pending
              </Button>
            ) : connectionStatus === 'declined' ? (
              <Button 
                size="sm" 
                variant="outline"
                className="w-full border-destructive/40 text-destructive"
                disabled
              >
                <X className="h-4 w-4 mr-2" />
                Declined
              </Button>
            ) : !isConnected ? (
              <Button 
                size="sm" 
                className="w-full"
                onClick={onConnect}
              >
                <Mail className="h-4 w-4 mr-2" />
                Connect
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="secondary"
                className="w-full"
                onClick={onConnect}
              >
                <Check className="h-4 w-4 mr-2" />
                Write Letter
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PenPalCard;
