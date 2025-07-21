
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { loginWithGoogle, currentUser, checkUsernameAvailable } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      navigate("/inbox");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      setError("");
      return;
    }

    const handler = setTimeout(async () => {
      setCheckingUsername(true);
      try {
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          setUsernameAvailable(false);
          setError("Username can only contain letters, numbers, and underscores");
          setCheckingUsername(false);
          return;
        }
        
        const isAvailable = await checkUsernameAvailable(username);
        setUsernameAvailable(isAvailable);
        setError(isAvailable ? "" : "Username already taken");
      } catch (error) {
        console.error("Error checking username availability:", error);
        setUsernameAvailable(true);
        setError("");
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [username, checkUsernameAvailable]);

  const handleGoogleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      await loginWithGoogle(username);
      navigate("/inbox");
    } catch (error: any) {
      let message = "Failed to sign in. Please try again.";
      
      if (error.code === "auth/popup-closed-by-user") {
        message = "Sign-in popup was closed. Please try again.";
      } else if (error.code === "auth/popup-blocked") {
        message = "Popup blocked. Please allow popups and try again.";
      }
      
      setError(message);
      console.error("Google sign in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      <div className="card-glass max-w-md w-full animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Your Eclipz Account
        </h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4 border-destructive/30 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleGoogleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Choose Your Username</Label>
            <div className="relative">
              <Input
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="glass pl-7"
                required
                minLength={3}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">@</span>
              
              {username.length >= 3 && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {checkingUsername ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : usernameAvailable ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              This will be your unique Eclipz link: {window.location.origin}/@{username}
            </p>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading || !username || username.length < 3 || usernameAvailable === false}
            className="w-full bg-primary hover:bg-primary/80 flex items-center justify-center gap-2"
          >
            {loading ? "Creating account..." : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                  </g>
                </svg>
                Sign in with Google
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>By signing up, you get your unique Eclipz username and can receive anonymous messages instantly.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
