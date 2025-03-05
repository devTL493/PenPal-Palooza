
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from 'lucide-react';

const NotFoundMessage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto text-center">
      <Mail className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
      <h1 className="mt-4 text-2xl font-medium">Letter not found</h1>
      <p className="mt-2 text-muted-foreground">The letter you're looking for doesn't exist or has been removed.</p>
      <Button onClick={() => navigate(-1)} className="mt-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>
    </div>
  );
};

export default NotFoundMessage;
