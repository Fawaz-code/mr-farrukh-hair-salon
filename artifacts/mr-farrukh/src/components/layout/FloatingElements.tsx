import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Phone, Scissors, X, Send, User, ChevronRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useSendChatMessage } from '@workspace/api-client-react';

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea, [role="button"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999]"
        animate={{ x: mousePosition.x - 4, y: mousePosition.y - 4 }}
        transition={{ type: 'spring', stiffness: 1000, damping: 28, mass: 0.1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[9998]"
        animate={{ 
          x: mousePosition.x - 16, 
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.5 : 0.8
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5 }}
      />
    </>
  );
}

function AIReceptionist() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Welcome to Mr Farrukh. How may I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  
  const sendMessage = useSendChatMessage();

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    
    try {
      const res = await sendMessage.mutateAsync({ data: { message: userMsg } });
      setMessages(prev => [...prev, { role: 'ai', text: res.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm sorry, I seem to be having trouble connecting. Please try WhatsApp." }]);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 left-0 w-80 h-[480px] glass-panel rounded-xl flex flex-col shadow-2xl overflow-hidden"
          >
            <div className="bg-primary p-4 flex justify-between items-center text-black">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                  <Scissors size={16} />
                </div>
                <div>
                  <h4 className="font-bold font-sans text-sm">AI Concierge</h4>
                  <p className="text-xs opacity-80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-900 inline-block animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-md transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-primary text-black rounded-br-sm' : 'bg-[#1A1A1A] text-foreground rounded-bl-sm border border-primary/10'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {sendMessage.isPending && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] text-foreground p-3 rounded-lg rounded-bl-sm border border-primary/10 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-primary/20 bg-black/50">
              <div className="flex flex-wrap gap-2 mb-3">
                {["Book Appointment", "Services", "Pricing"].map(chip => (
                  <button 
                    key={chip} 
                    onClick={() => handleSend(chip)}
                    className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary hover:text-black transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask me anything..." 
                  className="w-full bg-[#111] border border-primary/30 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-primary text-foreground"
                />
                <button 
                  onClick={() => handleSend(input)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-accent disabled:opacity-50"
                  disabled={!input.trim() || sendMessage.isPending}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-110 transition-transform"
      >
        {isOpen ? <X size={24} /> : <Scissors size={24} />}
      </button>
    </div>
  );
}

export function FloatingElements() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <CustomCursor />
      
      <AIReceptionist />

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a 
          href="tel:+923477268791" 
          className="w-12 h-12 bg-[#1A1A1A] text-primary border border-primary/30 rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all group relative"
        >
          <Phone size={20} />
          <span className="absolute right-full mr-3 whitespace-nowrap bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Call Us
          </span>
        </a>
        <a 
          href="https://wa.me/923477268791?text=Hello%20Mr%20Farrukh%20Hair%20Saloon%2C%0AI%20would%20like%20to%20book%20an%20appointment.%0A%0AName%3A%0APhone%3A%0APreferred%20Service%3A%0APreferred%20Date%3A%0APreferred%20Time%3A" 
          target="_blank" 
          rel="noreferrer"
          className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:bg-[#128C7E] transition-all shadow-[0_0_15px_rgba(37,211,102,0.4)] group relative"
        >
          <FaWhatsapp size={24} />
          <span className="absolute right-full mr-3 whitespace-nowrap bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            WhatsApp Booking
          </span>
        </a>
        <AnimatePresence>
          {showTop && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-black border border-primary/20 text-primary rounded-full flex items-center justify-center hover:bg-primary/10 transition-all mt-4"
            >
              <ArrowUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
