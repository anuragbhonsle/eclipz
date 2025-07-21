
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface MessageCardProps {
  id: string;
  message: string;
  timestamp: any;
  reported: boolean;
}

const MessageCard: React.FC<MessageCardProps> = ({ id, message, timestamp, reported }) => {
  const [isReporting, setIsReporting] = useState(false);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const handleReport = async () => {
    try {
      setIsReporting(true);
      const messageRef = doc(db, "messages", id);
      await updateDoc(messageRef, {
        reported: true
      });
      toast.success("Message reported");
    } catch (error) {
      toast.error("Failed to report message");
      console.error("Error reporting message:", error);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <Card className="w-full glass">
      <CardContent className="pt-6">
        <p className="text-foreground mb-4">{message}</p>
        <p className="text-xs text-muted-foreground">
          {formatDate(timestamp)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        {!reported ? (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReport}
            disabled={isReporting}
          >
            {isReporting ? "Reporting..." : "Report"}
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">Reported</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
