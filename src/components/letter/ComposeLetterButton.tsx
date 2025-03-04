
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, ButtonProps } from "@/components/ui/button";
import { PenTool } from 'lucide-react';

interface ComposeLetterButtonProps extends ButtonProps {
  recipientId?: string;
  recipientName?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

const ComposeLetterButton: React.FC<ComposeLetterButtonProps> = ({
  recipientId,
  recipientName,
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) => {
  // Create URL with query parameters for recipient if provided
  const composeUrl = recipientId 
    ? `/compose?recipient=${recipientId}${recipientName ? `&name=${encodeURIComponent(recipientName)}` : ''}`
    : '/compose';

  return (
    <Link to={composeUrl}>
      <Button 
        variant={variant} 
        size={size}
        className={className}
        {...props}
      >
        {children || (
          <>
            <PenTool className="mr-2 h-4 w-4" />
            Compose a Letter
          </>
        )}
      </Button>
    </Link>
  );
};

export default ComposeLetterButton;
