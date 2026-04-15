import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { chatWithAI } from "../lib/gemini";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  User, 
  Bot,
  Loader2,
  RefreshCw,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hello! I'm HireSense AI. How can I help you with your career today? You can ask me about resume tips, interview prep, or career paths." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatWithAI(userMessage);
      setMessages(prev => [...prev, { role: "bot", content: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "How can I improve my resume for Data Science?",
    "What are the top skills for a Web Developer in 2024?",
    "How to prepare for a system design interview?",
    "Tell me about the career path for a Product Manager."
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-slate-900">AI Career Chat</h1>
          <p className="text-slate-500">Your personal AI career coach, available 24/7.</p>
        </div>
        <Button variant="outline" onClick={() => setMessages([messages[0]])} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Clear Chat
        </Button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Chat Area */}
        <Card className="flex-1 flex flex-col shadow-sm border-slate-200 overflow-hidden">
          <CardHeader className="border-b border-slate-100 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">HireSense AI</CardTitle>
                <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                  Online
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user" ? "bg-slate-200" : "bg-primary/10"
                    }`}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-primary" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-slate-100 text-slate-700 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="h-12 bg-white border-slate-200 shadow-sm"
              />
              <Button type="submit" disabled={!input.trim() || isLoading} className="h-12 px-6 gap-2">
                <Send className="w-4 h-4" /> Send
              </Button>
            </form>
          </div>
        </Card>

        {/* Suggestions Sidebar */}
        <div className="w-72 space-y-6 hidden lg:block">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="w-full text-left p-3 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-all border border-transparent hover:border-slate-100"
                >
                  {s}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 bg-slate-900 text-white">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-bold">Pro Tips</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Mention your target role and specific skills to get more tailored advice from the AI.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
