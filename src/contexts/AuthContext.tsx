
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  signOut,
  onAuthStateChanged,
  User,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp, 
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithGoogle: (customUsername?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  async function checkUsernameAvailable(username: string): Promise<boolean> {
    if (!username || username.length < 3) return false;
    
    try {
      const formattedUsername = username.startsWith('@') ? username : `@${username}`;
      
      if (!/^@[a-zA-Z0-9_]+$/.test(formattedUsername)) {
        return false;
      }
      
      // For now, return true to allow sign-in while Firestore rules are being set up
      // TODO: Implement proper username checking after Firestore rules are configured
      console.log("Username check bypassed for setup:", formattedUsername);
      return true;
    } catch (error) {
      console.error("Error checking username availability:", error);
      return true;
    }
  }
  
  async function loginWithGoogle(customUsername?: string): Promise<void> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // For initial setup, just use the provided username or create from email
      let username: string;
      
      if (customUsername) {
        username = customUsername.startsWith('@') ? customUsername : `@${customUsername}`;
      } else {
        // Create default username from email
        const emailPrefix = user.email?.split('@')[0] || 'user';
        username = `@${emailPrefix}`;
      }
      
      // Update the user's display name to the username
      await firebaseUpdateProfile(user, {
        displayName: username
      });
      
      // Try to save to Firestore, but don't fail if it doesn't work yet
      try {
        await setDoc(doc(db, "users", user.uid), {
          username,
          email: user.email,
          createdAt: serverTimestamp(),
          authProvider: 'google'
        }, { merge: true });
      } catch (firestoreError) {
        console.log("Firestore not ready yet, user data will be saved later");
      }
      
      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error("Google login error:", error);
      
      if (error.code === "auth/unauthorized-domain") {
        toast.error("This domain is not authorized. Please contact support or configure Firebase domains.");
      } else if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in cancelled. Please try again.");
      } else {
        toast.error("Sign-in failed. Please try again.");
      }
      throw error;
    }
  }

  async function updateUsername(newUsername: string): Promise<void> {
    if (!currentUser) throw new Error("No user logged in");
    
    try {
      const formattedUsername = newUsername.startsWith('@') ? newUsername : `@${newUsername}`;
      
      const isAvailable = await checkUsernameAvailable(formattedUsername);
      if (!isAvailable) {
        throw new Error("Username already taken. Please choose another.");
      }
      
      await firebaseUpdateProfile(currentUser, {
        displayName: formattedUsername
      });
      
      await setDoc(doc(db, "users", currentUser.uid), {
        username: formattedUsername
      }, { merge: true });
      
      toast.success("Username updated successfully!");
    } catch (error) {
      console.error("Username update error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update username");
      throw error;
    }
  }

  async function logout(): Promise<void> {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    loginWithGoogle,
    logout,
    updateUsername,
    checkUsernameAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
