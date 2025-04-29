
import React, { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogHeader
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
}

// Function to simulate chatbot response
const generateResponse = (message: string): Promise<string> => {
  return new Promise((resolve) => {
    // In a real implementation, this would call the Gemini API
    const lowerMsg = message.toLowerCase();
    
    // Simple pattern matching for demo purposes
    let response = '';
    
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      response = "Hello! I'm your Lab Assistant. How can I help you today?";
    } else if (lowerMsg.includes('available') || lowerMsg.includes('book')) {
      response = "To check equipment availability, please go to the Inventory tab and look for items with an 'Available' status. You can book them by clicking the 'Book Now' button.";
    } else if (lowerMsg.includes('manual') || lowerMsg.includes('instruction')) {
      response = "Equipment manuals can be accessed by clicking on the specific equipment and navigating to the 'Documentation' tab. You can also ask me specific questions about operation procedures.";
    } else if (lowerMsg.includes('maintenance') || lowerMsg.includes('repair') || lowerMsg.includes('broken')) {
      response = "To report equipment issues, please use the 'Report Issue' button on the equipment details page. Provide a detailed description of the problem for our maintenance team.";
    } else if (lowerMsg.includes('policy') || lowerMsg.includes('policies') || lowerMsg.includes('rule')) {
      response = "Lab policies require booking equipment at least 24 hours in advance. Equipment must be returned in the same condition. For full policy details, please check the Lab Handbook.";
    } else {
      response = "I'm not sure I understand your question. Could you rephrase it or ask about equipment availability, usage instructions, maintenance reporting, or lab policies?";
    }
    
    // Simulate network delay
    setTimeout(() => resolve(response), 600);
  });
};

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm your Lab Assistant. How can I help you with lab equipment today?",
      isBot: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      isBot: false
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Get bot response
    try {
      const response = await generateResponse(input);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        isBot: true
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5 text-primary" />
            Lab Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.isBot
                    ? 'bg-secondary text-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <div className="flex items-center mb-1">
                  {msg.isBot ? (
                    <Bot className="h-4 w-4 mr-1" />
                  ) : (
                    <User className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs font-medium">
                    {msg.isBot ? 'Lab Assistant' : 'You'}
                  </span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-secondary text-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex-shrink-0 pt-4">
          <div className="flex w-full">
            <Input
              placeholder="Ask about equipment or lab policies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="ml-2"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Chatbot;
