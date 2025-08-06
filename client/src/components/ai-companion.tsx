import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Mic } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  message: string;
  isAI: boolean;
  createdAt: string;
}

interface AICompanionProps {
  userId: string;
  religion: string | undefined;
  userName: string | undefined;
}

const AI_PERSONAS = {
  buddhism: {
    name: "智慧法師",
    avatar: "👨‍🦲",
    bgColor: "from-warm-gold to-yellow-500",
  },
  taoism: {
    name: "逍遙道長",
    avatar: "🧙‍♂️",
    bgColor: "from-sage-green to-green-500",
  },
  mazu: {
    name: "慈悲仙姑",
    avatar: "👩‍🦳",
    bgColor: "from-ocean-blue to-blue-500",
  },
};

export default function AICompanion({ userId, religion, userName }: AICompanionProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const persona = AI_PERSONAS[religion as keyof typeof AI_PERSONAS] || AI_PERSONAS.buddhism;

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ['/api/user', userId, 'chat'],
    enabled: !!userId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest('POST', '/api/chat', {
        userId,
        message: messageText,
        isAI: false,
      });
      return response.json();
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', userId, 'chat'] });
      setMessage("");
      setIsTyping(false);
    },
    onError: () => {
      toast({
        title: "發送失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-TW', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Card className="shadow-lg overflow-hidden" data-testid="ai-companion">
      <div className={`bg-gradient-to-r ${persona.bgColor} p-6`}>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
            <span className="text-2xl">{persona.avatar}</span>
          </div>
          <div>
            <h3 className="text-elderly-xl font-semibold text-white mb-1">
              {persona.name}
            </h3>
            <p className="text-white text-opacity-90 text-elderly-base">
              您的修行夥伴・隨時陪伴
            </p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-6 space-y-4" data-testid="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex items-start space-x-3 ${msg.isAI ? '' : 'flex-row-reverse space-x-reverse'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.isAI 
                ? 'bg-warm-gold bg-opacity-20' 
                : 'bg-ocean-blue bg-opacity-20'
            }`}>
              <span className="text-sm">
                {msg.isAI ? persona.avatar : "👤"}
              </span>
            </div>
            <div className={`rounded-2xl p-4 max-w-xs ${
              msg.isAI 
                ? 'bg-warm-gray-50 rounded-tl-sm' 
                : 'bg-warm-gold bg-opacity-20 rounded-tr-sm'
            }`}>
              <p className="text-elderly-base text-gray-800 mb-2">
                {msg.message}
              </p>
              <span className={`text-elderly-xs text-warm-gray-600 block ${
                msg.isAI ? '' : 'text-right'
              }`}>
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-warm-gold bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm">{persona.avatar}</span>
            </div>
            <div className="bg-warm-gray-50 rounded-2xl rounded-tl-sm p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-warm-gray-100 p-6">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="輸入您想說的話..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 text-elderly-base border-warm-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-warm-gold focus:border-transparent"
            disabled={sendMessageMutation.isPending}
            data-testid="input-chat-message"
          />
          <Button
            type="submit"
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="w-12 h-12 bg-warm-gold text-white rounded-xl hover:bg-opacity-90 transition-colors"
            data-testid="button-send-message"
          >
            <Send className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-12 h-12 bg-warm-gray-100 text-warm-gray-600 rounded-xl hover:bg-warm-gray-200 transition-colors"
            title="語音輸入"
            data-testid="button-voice-input"
          >
            <Mic className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
