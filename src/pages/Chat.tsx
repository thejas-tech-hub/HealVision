import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { sendChatMessage } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm your AI Health Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [mindCare, setMindCare] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ✅ Scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      setIsTyping(true);

      const response = await sendChatMessage({
        messages: updatedMessages,
        mindCare,
        targetLanguage: "English",
        profile: {},
      });

      const data = await response.json();
      const replyText =
        data.reply || "I'm here to help! Could you please provide a few more details?";

      // Simulate typing delay for realism
      const typingDelay = 30;
      let displayedText = "";

      const typeEffect = () => {
        if (displayedText.length < replyText.length) {
          displayedText += replyText.charAt(displayedText.length);
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: displayedText },
          ]);
          setTimeout(typeEffect, typingDelay);
        } else {
          setIsTyping(false);
        }
      };

      // Add empty assistant message to start typing animation
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      typeEffect();
    } catch (error) {
      console.error("❌ Chat send failed:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-4"
      >
        ← Back to Dashboard
      </Button>

      <Card className="border-border shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-400 to-purple-600 text-white flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            💬 AI Doctor Chat
          </CardTitle>
          <div className="flex items-center gap-2">
            <span>MindCare Mode</span>
            <Switch
              checked={mindCare}
              onCheckedChange={setMindCare}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4 p-6 h-[70vh] overflow-y-auto bg-muted/40">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 text-sm max-w-[75%] shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white"
                    : "bg-white text-gray-800 border border-border"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex justify-start text-muted-foreground"
            >
              <div className="bg-white border border-border rounded-2xl px-4 py-2 shadow-sm">
                <span className="animate-pulse">Typing...</span>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef}></div>
        </CardContent>

        <div className="flex items-center border-t border-border bg-background px-4 py-3">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 mr-3"
          />
          <Button onClick={handleSend} disabled={!input || isTyping}>
            ➤
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
