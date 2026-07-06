import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowUp, X, Send, Sparkles } from 'lucide-react';
import { useSendChatMessage } from '@workspace/api-client-react';

// ── Social icons ──────────────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width="22" height="22" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.66 1.438 5.168L2 22l4.979-1.306A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.073-1.116l-.292-.174-3.026.794.808-2.957-.19-.303A7.944 7.944 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.406-5.884c-.241-.121-1.428-.703-1.65-.784-.221-.08-.382-.121-.543.121-.16.241-.623.784-.764.944-.14.16-.281.181-.522.06-.241-.12-1.017-.375-1.937-1.195-.715-.638-1.199-1.426-1.339-1.667-.14-.241-.015-.371.105-.491.109-.109.241-.281.362-.422.12-.14.16-.241.241-.402.08-.16.04-.301-.02-.422-.06-.12-.543-1.308-.744-1.79-.195-.47-.394-.406-.543-.414-.14-.006-.301-.008-.462-.008-.16 0-.422.06-.643.301-.221.241-.844.825-.844 2.012 0 1.188.865 2.336.985 2.497.12.16 1.703 2.6 4.126 3.645.577.249 1.027.398 1.378.51.579.183 1.106.157 1.523.095.464-.07 1.428-.584 1.63-1.148.2-.564.2-1.047.14-1.148-.06-.1-.221-.16-.462-.281z" />
    </svg>
  );
}

// ── Chat scroll anchor ────────────────────────────────────────────────────────

function useChatScroll(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dep]);
  return ref;
}

// ── FAB button component ──────────────────────────────────────────────────────

function FabButton({
  onClick,
  href,
  target,
  rel,
  label,
  children,
  className,
}: {
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  label: string;
  children: React.ReactNode;
  className: string;
}) {
  const base =
    'w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50';

  if (href) {
    return (
      <motion.a
        href={href}
        target={target}
        rel={rel}
        aria-label={label}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className={`${base} ${className}`}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.93 }}
      className={`${base} ${className}`}
    >
      {children}
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function FloatingElements() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Welcome to Mr Farrukh Hair Saloon! ✨\n\nI\'m your AI Concierge. Ask me anything about our services, pricing, location, or how to book an appointment.' },
  ]);
  const sendChat = useSendChatMessage();
  const bottomRef = useChatScroll(chatHistory);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatMessage.trim();
    if (!text) return;
    setChatHistory(prev => [...prev, { role: 'user', content: text }]);
    setChatMessage('');
    sendChat.mutate(
      { data: { message: text } },
      {
        onSuccess: data => {
          setChatHistory(prev => [...prev, { role: 'ai', content: data.reply }]);
        },
        onError: () => {
          setChatHistory(prev => [
            ...prev,
            { role: 'ai', content: 'Sorry, something went wrong. Please try again or call us at 0320-5814165.' },
          ]);
        },
      }
    );
  };

  // ── Fab size token: 52px (w-13 h-13 = 3.25rem)
  const fabCls = 'w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-lg';

  return (
    <>
      {/* ── LEFT SIDE — social + WhatsApp ────────────────────────────────────── */}
      <div className="fixed bottom-6 left-4 sm:left-6 z-50 flex flex-col gap-3 items-start">
        {/* Instagram */}
        <FabButton
          href="https://www.instagram.com/mr_farrukh_salon?igsh=MTlqNjY5d3piODU2"
          target="_blank"
          rel="noopener noreferrer"
          label="Follow us on Instagram"
          className={`${fabCls} bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 text-white`}
        >
          <InstagramIcon />
        </FabButton>

        {/* TikTok */}
        <FabButton
          href="https://www.tiktok.com/@mr.farrukh.hair.sa?_r=1&_t=ZS-97kbR4n7O0T"
          target="_blank"
          rel="noopener noreferrer"
          label="Follow us on TikTok"
          className={`${fabCls} bg-[#010101] border border-white/10 text-white`}
        >
          <TikTokIcon />
        </FabButton>

        {/* WhatsApp */}
        <FabButton
          href="https://wa.me/923477268791"
          target="_blank"
          rel="noopener noreferrer"
          label="Chat on WhatsApp"
          className={`${fabCls} bg-[#25D366] text-white`}
        >
          <WhatsAppIcon />
        </FabButton>
      </div>

      {/* ── RIGHT SIDE — AI + Phone + back-to-top ──────────────────────────── */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3 items-end">

        {/* Back to top — appears on scroll */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              className={`${fabCls} glass-panel border border-white/15 text-white backdrop-blur-md`}
            >
              <ArrowUp size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Phone */}
        <FabButton
          href="tel:+923205814165"
          label="Call us"
          className={`${fabCls} glass-panel border border-white/15 text-white backdrop-blur-md`}
        >
          <Phone size={20} />
        </FabButton>

        {/* AI Concierge */}
        <motion.button
          onClick={() => setIsChatOpen(v => !v)}
          aria-label={isChatOpen ? 'Close AI Concierge' : 'Open AI Concierge'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          className={`${fabCls} bg-gradient-to-br from-primary to-blue-700 text-white shadow-[0_0_24px_rgba(28,78,216,0.45)]`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isChatOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span key="spark" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Sparkles size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Chat panel — anchored above right FABs ─────────────────────────── */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="fixed bottom-[calc(52px*2+1.5rem*2+1.5rem)] right-4 sm:right-6 z-50
                       w-[calc(100vw-2rem)] max-w-[340px]
                       glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            style={{ maxHeight: 'min(480px, calc(100dvh - 220px))' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-primary/15 shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground font-serif leading-tight">AI Concierge</p>
                <p className="text-[10px] text-secondary leading-none">Mr Farrukh Hair Saloon</p>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                aria-label="Close chat"
                className="ml-auto text-secondary hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[88%] px-3 py-2.5 rounded-xl text-[13px] leading-relaxed whitespace-pre-line
                    ${msg.role === 'user'
                      ? 'bg-primary text-white ml-auto rounded-tr-sm'
                      : 'bg-white/10 text-foreground mr-auto rounded-tl-sm'}`}
                >
                  {msg.content}
                </div>
              ))}
              {sendChat.isPending && (
                <div className="bg-white/10 text-secondary mr-auto rounded-tl-sm px-3 py-2.5 rounded-xl text-[13px] flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:300ms]" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex gap-2 shrink-0">
              <input
                type="text"
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Ask about services, pricing…"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-primary/60 text-foreground placeholder:text-secondary/60"
              />
              <button
                type="submit"
                disabled={sendChat.isPending || !chatMessage.trim()}
                aria-label="Send message"
                className="bg-primary hover:bg-primary/80 disabled:opacity-40 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
