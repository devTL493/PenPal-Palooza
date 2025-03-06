
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
  conversation?: boolean;
  position?: 'bottom-right' | 'inline';
  compact?: boolean;
}

const ComposeLetterButton: React.FC<ComposeLetterButtonProps> = ({
  recipientId,
  recipientName,
  className,
  variant = "default",
  size = "default",
  children,
  conversation = false,
  position = 'inline',
  compact = false,
  ...props
}) => {
  // Create URL with query parameters for recipient if provided
  const composeUrl = recipientId 
    ? `/compose?recipient=${recipientId}${recipientName ? `&name=${encodeURIComponent(recipientName)}` : ''}${conversation ? '&conversation=true' : ''}`
    : '/compose';

  // Apply fixed position styling for bottom-right button
  const positionClassNames = position === 'bottom-right' 
    ? 'fixed bottom-6 right-6 shadow-lg rounded-full z-20'
    : '';

  // Apply compact styling for buttons that appear below messages
  const compactClasses = compact 
    ? 'text-sm py-1 px-3 h-auto'
    : '';

  return (
    <Link to={composeUrl}>
      <Button 
        variant={variant} 
        size={size}
        className={`${className} ${positionClassNames} ${compactClasses}`}
        {...props}
      >
        {children || (
          <>
            <PenTool className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} mr-2`} />
            {compact ? 'Reply' : 'Compose a Letter'}
          </>
        )}
      </Button>
    </Link>
  );
};

export default ComposeLetterButton;
