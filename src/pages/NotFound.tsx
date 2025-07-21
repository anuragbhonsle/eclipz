
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import SendMessage from "./SendMessage";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Extract potential username from the pathname
    const pathParts = location.pathname.split("/");
    // The username would be the last part of the path (including @ symbol)
    let potentialUsername = pathParts[pathParts.length - 1];
    
    // Check if this might be a username route
    if (potentialUsername && potentialUsername !== "") {
      // Make sure it has the @ prefix for checking
      if (!potentialUsername.startsWith('@')) {
        potentialUsername = `@${potentialUsername}`;
      }
      
      // Check in Firebase if this username exists
      const checkUsername = async () => {
        try {
          setChecking(true);
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("username", "==", potentialUsername));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // User exists, update state
            setIsUser(true);
            setUsername(potentialUsername);
          } else {
            setIsUser(false);
          }
        } catch (error) {
          console.error("Error checking username:", error);
          setIsUser(false);
        } finally {
          setChecking(false);
        }
      };

      checkUsername();
    } else {
      setChecking(false);
    }
  }, [location.pathname]);

  // Return the SendMessage component if we found a valid username
  if (isUser && username) {
    return <SendMessage />;
  }

  // Show loading state while checking
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
        <div className="card-glass max-w-md w-full text-center">
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p>Checking page...</p>
        </div>
      </div>
    );
  }

  // Show 404 if not a valid user or another path
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="card-glass max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">Oops! Page not found</p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/80">Return Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
