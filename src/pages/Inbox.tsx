
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import InboxHeader from "@/components/inbox/InboxHeader";
import MessageList from "@/components/inbox/MessageList";
import { useInboxMessages } from "@/hooks/useInboxMessages";

const Inbox = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const { 
    messages, 
    loading, 
    loadMoreMessages, 
    isLoadingMore, 
    hasMore 
  } = useInboxMessages();

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  const copyLinkToClipboard = () => {
    if (!currentUser || !currentUser.displayName) return;

    const username = currentUser.displayName.startsWith('@') 
      ? currentUser.displayName.substring(1) 
      : currentUser.displayName;
      
    const link = `${window.location.origin}/@${username}`;
    
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Eclipz link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
        toast.error("Failed to copy link");
      });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <InboxHeader 
          username={currentUser.displayName || ""} 
          onCopyLink={copyLinkToClipboard} 
        />

        <h2 className="text-xl font-semibold mb-4">Your Messages</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : messages.length > 0 ? (
          <>
            <MessageList messages={messages} />
            
            {hasMore && (
              <div className="mt-6 text-center">
                <Button
                  onClick={loadMoreMessages}
                  disabled={isLoadingMore}
                  variant="outline"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    "Load More Messages"
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-muted-foreground mb-4">
              Share your Eclipz username with friends to start receiving anonymous
              messages.
            </p>
            <Button
              onClick={copyLinkToClipboard}
              className="bg-primary hover:bg-primary/80"
            >
              Copy My Link
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
