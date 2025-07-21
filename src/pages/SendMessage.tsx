
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";

const SendMessage = () => {
  const { username } = useParams<{ username: string }>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [sent, setSent] = useState(false);
  const [searchUsername, setSearchUsername] = useState(username || "");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (username) {
      checkUserExists(username);
    } else {
      setUserExists(null);
    }
  }, [username]);
  
  const checkUserExists = async (usernameToCheck: string) => {
    if (!usernameToCheck) {
      setUserExists(false);
      return;
    }
    
    try {
      // Make sure username has @ prefix for database query
      const formattedUsername = usernameToCheck.startsWith('@') 
        ? usernameToCheck 
        : `@${usernameToCheck}`;
      
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", formattedUsername));
      const querySnapshot = await getDocs(q);
      
      setUserExists(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking user:", error);
      toast.error("Error checking username. Please try again.");
      setUserExists(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      // Remove @ if user typed it at the start
      const formattedUsername = searchUsername.trim().startsWith('@')
        ? searchUsername.trim().substring(1)
        : searchUsername.trim();
      
      navigate(`/@${formattedUsername}`);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    
    if (message.length > 500) {
      toast.error("Message too long (max 500 characters)");
      return;
    }
    
    setLoading(true);
    
    try {
      // Format the username with @ prefix for the database
      const formattedUsername = username?.startsWith('@') 
        ? username 
        : `@${username}`;
      
      await addDoc(collection(db, "messages"), {
        message: message.trim(),
        recipientUsername: formattedUsername,
        timestamp: serverTimestamp(),
        reported: false
      });
      
      setMessage("");
      setSent(true);
      toast.success("Message sent anonymously!");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // No username provided - search form
  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
        <div className="card-glass max-w-md w-full animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Send Anonymous Message
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-4 mb-6">
            <div className="relative">
              <Input
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Enter username..."
                className="glass pl-7"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
              <Button 
                type="submit" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full px-3"
              >
                <Search size={18} />
              </Button>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/80"
            >
              Find User
            </Button>
          </form>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't know their username? Ask them to share it with you!
          </p>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (userExists === null) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
        <div className="card-glass max-w-md w-full text-center">
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p>Checking username...</p>
        </div>
      </div>
    );
  }
  
  // User not found
  if (userExists === false) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
        <div className="card-glass max-w-md w-full text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find anyone with the username "{username}"
          </p>
          
          <form onSubmit={handleSearch} className="space-y-4 mb-6">
            <div className="relative">
              <Input
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Try another username..."
                className="glass pl-7"
                required
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/80"
            >
              Search
            </Button>
          </form>
          
          <div className="pt-4 border-t border-border">
            <Link to="/">
              <Button variant="outline" className="w-full">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Message sent confirmation
  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
        <div className="card-glass max-w-md w-full text-center animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
          <p className="text-muted-foreground mb-6">
            Your anonymous message has been delivered to {username}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setSent(false)}
              className="bg-primary hover:bg-primary/80"
            >
              Send Another
            </Button>
            <Link to="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Send message form
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="card-glass max-w-md w-full animate-fade-in">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Send a message to {username}
        </h2>
        <p className="text-muted-foreground mb-6 text-center">
          This message will be sent anonymously.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your anonymous message here..."
            className="min-h-32 glass"
            required
          />
          <p className="text-xs text-right text-muted-foreground">
            {message.length}/500 characters
          </p>
          <Button 
            type="submit" 
            disabled={loading || !message.trim()}
            className="w-full bg-primary hover:bg-primary/80"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </div>
            ) : "Send Anonymously"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SendMessage;
