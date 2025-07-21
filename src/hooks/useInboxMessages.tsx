
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  enableNetwork,
  limit,
  getDocs,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export interface Message {
  id: string;
  message: string;
  timestamp: any;
  reported: boolean;
}

export const useInboxMessages = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const messagesPerPage = 10;

  useEffect(() => {
    if (!currentUser || !currentUser.displayName) {
      setLoading(false);
      return () => {};
    }

    // Enable network and load initial messages
    const loadInitialMessages = async () => {
      try {
        await enableNetwork(db);
        
        const messagesRef = collection(db, "messages");
        const q = query(
          messagesRef,
          where("recipientUsername", "==", currentUser.displayName),
          orderBy("timestamp", "desc"),
          limit(messagesPerPage)
        );

        // Use onSnapshot for real-time updates
        const unsubscribe = onSnapshot(
          q,
          (querySnapshot) => {
            const messagesData: Message[] = [];
            querySnapshot.forEach((doc) => {
              messagesData.push({
                id: doc.id,
                message: doc.data().message,
                timestamp: doc.data().timestamp,
                reported: doc.data().reported || false,
              });
            });
            
            // Set the last document for pagination
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setLastVisible(lastDoc || null);
            
            setMessages(messagesData);
            setLoading(false);
            setHasMore(querySnapshot.docs.length === messagesPerPage);
          },
          (error) => {
            console.error("Error loading messages:", error);
            toast.error("Error loading messages. Please try again.");
            setLoading(false);
          }
        );

        return unsubscribe;
      } catch (error) {
        console.error("Error loading initial messages:", error);
        setLoading(false);
        return () => {};
      }
    };

    // Start loading messages
    const unsubscribePromise = loadInitialMessages();
    
    // Clean up function
    return () => {
      unsubscribePromise.then(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      }).catch(error => {
        console.error("Error unsubscribing:", error);
      });
    };
  }, [currentUser]);

  const loadMoreMessages = async () => {
    if (!currentUser?.displayName || isLoadingMore || !hasMore || !lastVisible) return;
    
    setIsLoadingMore(true);
    
    try {
      const messagesRef = collection(db, "messages");
      
      const q = query(
        messagesRef,
        where("recipientUsername", "==", currentUser.displayName),
        orderBy("timestamp", "desc"),
        startAfter(lastVisible),
        limit(messagesPerPage)
      );
      
      const querySnapshot = await getDocs(q);
      
      const newMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          message: doc.data().message,
          timestamp: doc.data().timestamp,
          reported: doc.data().reported || false,
        });
      });
      
      // Update the last visible document
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      if (lastDoc) {
        setLastVisible(lastDoc);
      }
      
      if (newMessages.length > 0) {
        setMessages(prev => [...prev, ...newMessages]);
      }
      
      setHasMore(querySnapshot.docs.length === messagesPerPage);
    } catch (error) {
      console.error("Error loading more messages:", error);
      toast.error("Failed to load more messages");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return {
    messages,
    loading,
    isLoadingMore,
    hasMore,
    loadMoreMessages
  };
};
