
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowDown, Search } from 'lucide-react';

const Index = () => {
  const { currentUser } = useAuth();
  const [searchUsername, setSearchUsername] = useState('');
  const typingTextRef = useRef<HTMLParagraphElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const text = "Anonymous messages. Zero judgment.";
    if (typingTextRef.current) {
      typingTextRef.current.textContent = "";
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length && typingTextRef.current) {
          typingTextRef.current.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 100);
        }
      };
      
      typeWriter();
    }
  }, []);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      const formattedUsername = searchUsername.trim().startsWith('@')
        ? searchUsername.trim().substring(1)
        : searchUsername.trim();
      
      navigate(`/@${formattedUsername}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-20 min-h-[90vh] relative">
        <div className="max-w-3xl w-full text-center space-y-8 z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Send Anonymous Messages
          </h1>
          
          <div className="typing-container">
            <p ref={typingTextRef} className="text-xl md:text-2xl text-muted-foreground pb-2"></p>
          </div>
          
          <div className="max-w-md mx-auto w-full bg-transparent mt-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="relative">
                <Input 
                  placeholder="Enter a username..."
                  className="glass py-6 text-lg pl-9"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">@</span>
                <Button 
                  type="submit" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full px-3"
                  disabled={!searchUsername.trim()}
                >
                  <Search size={20} />
                </Button>
              </div>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/80 py-6 text-lg"
                disabled={!searchUsername.trim()}
              >
                Send Anonymous Message
              </Button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            {currentUser ? (
              <Link to="/inbox">
                <Button variant="outline" className="px-6">
                  View My Inbox
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="w-full sm:w-auto px-6">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
            <button onClick={scrollToHowItWorks} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <span>How it works</span>
              <ArrowDown size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How Eclipz Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div className="card-glass flex flex-col items-center text-center p-8 h-full transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Create Account</h3>
              <p className="text-muted-foreground">Sign up to receive messages and get your unique @username</p>
            </div>
            
            <div className="card-glass flex flex-col items-center text-center p-8 h-full transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Share Your Username</h3>
              <p className="text-muted-foreground">Tell friends your @username so they can message you</p>
            </div>
            
            <div className="card-glass flex flex-col items-center text-center p-8 h-full transition-transform hover:scale-105">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Receive Messages</h3>
              <p className="text-muted-foreground">Check your private inbox for anonymous messages from anyone</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center mt-10">
            {currentUser ? (
              <Link to="/inbox">
                <Button className="bg-primary hover:bg-primary/80 transition-colors px-8 py-6 text-lg">
                  View My Inbox
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button className="bg-primary hover:bg-primary/80 transition-colors px-8 py-6 text-lg">
                  Create Your Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to hear what people really think?</h2>
          <p className="text-muted-foreground">
            Join thousands of users receiving honest, anonymous feedback through Eclipz.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            {currentUser ? (
              <Link to="/inbox">
                <Button className="bg-primary hover:bg-primary/80 transition-colors px-8">
                  Check My Messages
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button className="bg-primary hover:bg-primary/80 transition-colors w-full sm:w-auto px-8">
                    Get My Eclipz Username
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
