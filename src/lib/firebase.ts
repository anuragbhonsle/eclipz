import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { toast } from "sonner";

const firebaseConfig = {
  apiKey: "AIzaSyDc3F1981ZNFqRR7uDl8hNsHdcW8vYQCGU",
  authDomain: "eclipz-app.firebaseapp.com",
  projectId: "eclipz-app",
  storageBucket: "eclipz-app.firebasestorage.app",
  messagingSenderId: "589442510742",
  appId: "1:589442510742:web:c656cc042e5243542577b7",
  measurementId: "G-DFCH67LKCC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Only initialize analytics in browser environment
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
export { analytics };

// Add error handler for Firebase operations
export const handleFirebaseError = (error: any) => {
  console.error("Firebase operation failed:", error);

  let errorMessage = "An error occurred";

  if (error.code === "permission-denied") {
    errorMessage = "Access denied. Please check your permissions.";
  } else if (error.code === "not-found") {
    errorMessage = "The requested resource was not found.";
  } else if (error.code === "already-exists") {
    errorMessage = "This resource already exists.";
  } else if (error.code === "resource-exhausted") {
    errorMessage = "Too many requests. Please try again later.";
  } else if (error.code === "failed-precondition") {
    errorMessage = "Operation failed due to a precondition.";
  } else if (error.code === "unauthenticated") {
    errorMessage = "Authentication required.";
  } else if (error.message) {
    errorMessage = error.message;
  }

  toast.error(errorMessage);
  return errorMessage;
};
