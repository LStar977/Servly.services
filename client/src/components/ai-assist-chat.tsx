import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockProviders } from "@/lib/data";
import { Send, CheckCircle, MapPin, Star, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Message {
  type: 'user' | 'bot';
  content: string;
  recommendations?: any[];
  action?: 'book' | 'pay';
  bookingData?: any;
}

interface AIAssistChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AIAssistChat({ open, onOpenChange }: AIAssistChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Hi! I\'m Servly Assist. What service do you need today? Just describe what you\'re looking for!',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { type: 'user', content: input };
    const currentInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const lastBotMsg = messages.find(m => m.type === 'bot');
      
      // If last bot message had recommendations, user is confirming booking
      if (lastBotMsg?.recommendations) {
        const recommendation = lastBotMsg.recommendations[0];
        const bookingConfirm: Message = {
          type: 'bot',
          content: `Perfect! I'm booking ${recommendation.businessName} for you at 9:00 AM tomorrow. Let's proceed to payment.`,
          action: 'pay',
          bookingData: {
            providerId: recommendation.id,
            serviceId: recommendation.services[0].id,
            time: '9:00 AM',
            date: 'Tomorrow',
          }
        };
        setMessages(prev => [...prev, bookingConfirm]);
      } else {
        // First request - provide recommendations
        const recommendations = mockProviders.filter(p => 
          currentInput.toLowerCase().includes('plumb') || 
          currentInput.toLowerCase().includes('leak') ||
          currentInput.toLowerCase().includes('clean') ||
          currentInput.toLowerCase().includes('detailing')
        );

        const responseContent = `I found ${recommendations.length} top-rated providers available tomorrow. Shall I book one for you?`;
        
        const botMessage: Message = {
          type: 'bot',
          content: responseContent,
          recommendations: recommendations.length > 0 ? recommendations : mockProviders.slice(0, 3),
        };
        setMessages(prev => [...prev, botMessage]);
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleBookNow = (provider: any) => {
    onOpenChange(false);
    setLocation(`/booking?providerId=${provider.id}`);
    toast({
      title: "Redirecting to booking",
      description: "Let's complete your service booking!",
    });
  };

  const handlePayNow = (bookingData: any) => {
    onOpenChange(false);
    setLocation(`/booking?providerId=${bookingData.providerId}&quick=true`);
    toast({
      title: "Proceeding to payment",
      description: "Let's complete your payment!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">S</div>
              Servly Assist
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 px-2 bg-muted/20 rounded-lg">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white text-foreground border border-muted-foreground/20 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>

                  {msg.recommendations && (
                    <div className="mt-3 space-y-2">
                      {msg.recommendations.map((provider) => (
                        <div key={provider.id} className="bg-muted p-3 rounded-lg mt-2 text-xs">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <p className="font-semibold">{provider.businessName}</p>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="w-3 h-3" /> {provider.city}
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 bg-yellow-50 px-2 py-1 rounded text-yellow-700">
                              <Star className="w-3 h-3 fill-current" /> {provider.rating}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-xs mb-2">{provider.services[0].title}</p>
                          <Button 
                            size="sm" 
                            className="w-full h-7 text-xs"
                            onClick={() => handleBookNow(provider)}
                          >
                            Book Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.action === 'pay' && (
                    <Button 
                      size="sm"
                      className="w-full mt-3 h-8 text-xs bg-green-600 hover:bg-green-700"
                      onClick={() => handlePayNow(msg.bookingData)}
                    >
                      <ArrowRight className="w-3 h-3 mr-1" /> Proceed to Payment
                    </Button>
                  )}

                  {msg.action === 'book' && (
                    <div className="flex items-center gap-1 text-green-600 mt-2">
                      <CheckCircle className="w-3 h-3" /> Booking Confirmed
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-foreground border border-muted-foreground/20 rounded-lg rounded-bl-none px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Input 
              placeholder="Describe what you need..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="text-sm"
            />
            <Button 
              size="sm"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  );
}
