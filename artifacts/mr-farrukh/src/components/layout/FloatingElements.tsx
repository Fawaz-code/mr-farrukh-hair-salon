import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ArrowUp, X, Send } from 'lucide-react';
import { useSendChatMessage } from '@workspace/api-client-react';

export function FloatingElements() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: 'Welcome to Mr Farrukh Hair Saloon. How can we assist you today?' }
  ]);

  const sendChat = useSendChatMessage();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatMessage("");

    sendChat.mutate({ data: { message: userMsg } }, {
      onSuccess: (data) => {
        setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
      }
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 h-96 glass-panel rounded-2xl overflow-hidden flex flex-col mb-2 shadow-2xl"
          >
            <div className="bg-primary/20 p-4 flex justify-between items-center border-b border-white/10">
              <h3 className="font-serif text-lg text-foreground">AI Concierge</h3>
              <button onClick={() => setIsChatOpen(false)} className="text-secondary hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white ml-auto rounded-tr-sm' : 'bg-white/10 text-foreground mr-auto rounded-tl-sm'}`}>
                  {msg.content}
                </div>
              ))}
              {sendChat.isPending && (
                <div className="bg-white/10 text-foreground mr-auto rounded-tl-sm p-3 rounded-xl text-sm animate-pulse">
                  Typing...
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about our services..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-foreground"
              />
              <button type="submit" disabled={sendChat.isPending} className="bg-primary hover:bg-primary/80 text-white p-2 rounded-lg transition-colors">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 text-white rounded-full flex items-center justify-center shadow-lg"
        data-testid="button-chat"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      <motion.a
        href="https://wa.me/923477268791?text=Hi%20Mr%20Farrukh%2C%20I%20would%20like%20to%20book%20an%20appointment"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg"
        data-testid="link-whatsapp"
      >
        <MessageCircle size={24} />
      </motion.a>

      <motion.a
        href="tel:+923205814165"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 glass-panel text-white rounded-full flex items-center justify-center shadow-lg"
        data-testid="link-phone"
      >
        <Phone size={24} />
      </motion.a>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 mt-4"
            data-testid="button-back-to-top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}