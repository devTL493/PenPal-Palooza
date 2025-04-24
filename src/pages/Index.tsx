
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion, useInView, useAnimation } from 'framer-motion';
import { Mail, Send, Inbox, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

const Index = () => {
  // Get authentication state
  const { user } = useAuth();
  
  // Animation refs and controls
  const controls = useAnimation();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const ctaInView = useInView(ctaRef, { once: true });
  
  // Trigger animations when sections come into view
  useEffect(() => {
    if (heroInView) {
      controls.start('visible');
    }
  }, [controls, heroInView]);

  const features = [
    {
      title: "Beautiful Letter Writing",
      description: "Experience the joy of crafting personal letters with our elegant, distraction-free writing interface.",
      icon: <Send className="h-6 w-6" />,
    },
    {
      title: "Find Thoughtful Pen Pals",
      description: "Connect with like-minded individuals who share your interests and passion for meaningful correspondence.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Organize Your Correspondence",
      description: "Keep track of your letters with our intuitive inbox system that preserves the charm of traditional mail.",
      icon: <Inbox className="h-6 w-6" />,
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Add Navigation component */}
      <Navigation />
      
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden texture"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-paper-light to-background z-[-1]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="container max-w-5xl mx-auto text-center"
        >
          <motion.div 
            className="inline-block mb-4 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Rediscover the art of letter writing
          </motion.div>
          
          <motion.h1 
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Connect through <br className="hidden sm:block" />
            <span className="text-primary">thoughtful letters</span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Experience the joy of meaningful correspondence in the digital age. 
            Write, share, and treasure letters with pen pals from around the world.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="h-12 px-6">
                  <Mail className="mr-2 h-5 w-5" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="h-12 px-6">
                  <Mail className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
              </Link>
            )}
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button variant="outline" size="lg" className="h-12 px-6">
                Explore
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Decorative paper elements */}
        <motion.div
          className="absolute bottom-[-5%] right-[-5%] md:right-[5%] transform rotate-6 w-64 h-80 rounded-md paper shadow-paper opacity-50"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.5, x: 0 }}
          transition={{ delay: 1, duration: 1.2 }}
        />
        <motion.div
          className="absolute top-[15%] left-[-5%] md:left-[5%] transform -rotate-3 w-48 h-64 rounded-md paper shadow-paper opacity-30"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ delay: 1.2, duration: 1.2 }}
        />
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-24 px-4 bg-white"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <motion.h2 
              className="font-serif text-3xl md:text-4xl font-medium text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              A modern platform with a timeless feel
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={featuresInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Combining the thoughtfulness of traditional correspondence with the convenience of digital communication.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="paper p-8 rounded-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5 text-primary">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-24 px-4 bg-gradient-to-b from-paper-light to-paper texture"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2 
            className="font-serif text-3xl md:text-4xl font-medium text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Ready to start your letter writing journey?
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Join thousands of people who are rediscovering the joy of thoughtful correspondence.
          </motion.p>
          
          <motion.div 
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="h-12 px-8">
                <Mail className="mr-2 h-5 w-5" />
                {user ? "Go to Dashboard" : "Get Started Today"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mail className="h-5 w-5 text-primary" />
              <span className="font-serif text-lg">PenPal</span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PenPal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
