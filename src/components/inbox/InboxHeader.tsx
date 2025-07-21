import React from "react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";

interface InboxHeaderProps {
  username: string;
  onCopyLink: () => void;
}

const InboxHeader = ({ username, onCopyLink }: InboxHeaderProps) => {
  // Format username for display - keep @ if present
  const displayName = username || "Loading...";
  
  // Format username for URL - remove @ if present
  const urlUsername = username.startsWith('@') 
    ? username.substring(1) 
    : username;
  
  const profileUrl = `${window.location.origin}/@${urlUsername}`;

  return (
    <div className="card-glass mb-8">
      <h1 className="text-2xl font-bold mb-4">Your Visper Inbox</h1>

      <div className="mb-6">
        <p className="text-muted-foreground mb-2">
          Share your username to receive anonymous messages:
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-secondary p-2 px-3 rounded-lg flex-1 text-sm md:text-base overflow-hidden">
            <span className="font-medium">{displayName}</span>
          </div>
          <Button
            onClick={onCopyLink}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Clipboard size={16} />
            Copy Link
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Others can message you by going to: {profileUrl}
        </p>
      </div>
    </div>
  );
};

export default InboxHeader;
