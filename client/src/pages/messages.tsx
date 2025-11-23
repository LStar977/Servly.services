import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { messageAPI } from "@/lib/api";
import type { Message } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function Messages() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const loadConversations = async () => {
      try {
        const convos = await messageAPI.getUserConversations(user.id);
        setConversations(convos);
      } catch (error) {
        console.error("Failed to load conversations:", error);
        toast({
          title: "Failed to load conversations",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadConversations();
  }, [user?.id, toast]);

  useEffect(() => {
    if (!selectedConversationId) return;
    const loadMessages = async () => {
      try {
        const msgs = await messageAPI.getConversation(selectedConversationId);
        setMessages(msgs);
        if (user?.id) {
          await messageAPI.markAsRead(selectedConversationId, user.id);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };
    loadMessages();
  }, [selectedConversationId, user?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || !user?.id) return;

    setIsSending(true);
    try {
      const otherParty = selectedConversationId.split("-").find(id => id !== user.id) || "";
      const message = await messageAPI.send({
        conversationId: selectedConversationId,
        senderId: user.id,
        receiverId: otherParty,
        message: newMessage,
      });
      setMessages([...messages, message]);
      setNewMessage("");
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Could not send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Please log in to access messages</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="md:col-span-1 border rounded-lg flex flex-col bg-card">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
              </div>
            ) : (
              conversations.map((convo) => (
                <button
                  key={convo.conversationId}
                  onClick={() => setSelectedConversationId(convo.conversationId)}
                  className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${
                    selectedConversationId === convo.conversationId ? "bg-muted" : ""
                  }`}
                  data-testid={`conversation-${convo.conversationId}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium truncate">Conversation</span>
                    {convo.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{convo.lastMessage.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(convo.lastMessage.createdAt), { addSuffix: true })}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages View */}
        <div className="md:col-span-2 border rounded-lg flex flex-col bg-card">
          {selectedConversationId ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversationId(null)}
                  className="md:hidden p-1 hover:bg-muted rounded"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h3 className="font-semibold flex-1">Conversation</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="text-sm">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
                      data-testid={`message-${idx}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderId === user.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isSending}
                  data-testid="message-input"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isSending || !newMessage.trim()}
                  size="sm"
                  className="gap-2"
                  data-testid="send-message-button"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="h-12 w-12 opacity-50" />
              <p className="ml-3">Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
