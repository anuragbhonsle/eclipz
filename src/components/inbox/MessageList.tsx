
import React from "react";
import MessageCard from "@/components/MessageCard";
import { Message } from "@/hooks/useInboxMessages";

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          id={message.id}
          message={message.message}
          timestamp={message.timestamp}
          reported={message.reported}
        />
      ))}
    </div>
  );
};

export default MessageList;
