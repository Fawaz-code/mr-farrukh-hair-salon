import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Team', path: '/team' },
  { name: 'Contact', path: '/contact' },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4"
      >
        <div className="max-w-7xl mx-auto glass-panel rounded-full px-5 sm:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl sm:text-2xl tracking-widest text-foreground font-semibold shrink-0">
            MR FARRUKH
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} className="relative group text-xs font-bold tracking-widest uppercase text-secondary hover:text-foreground transition-colors py-2">
                {link.name}
                {location === link.path && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link href="/book" className="bg-primary hover:bg-primary/90 text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(28,78,216,0.3)] hover:shadow-[0_0_30px_rgba(28,78,216,0.5)]">
              Reserve Time
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="lg:hidden w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden flex flex-col pt-32 px-6 pb-8"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={link.path} 
                    className={`block py-5 px-6 rounded-2xl text-lg font-serif tracking-widest transition-colors ${location === link.path ? 'bg-primary/20 text-primary border border-primary/20' : 'text-foreground hover:bg-white/5 border border-transparent'}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-auto pt-8 border-t border-white/10 text-center"
            >
              <div className="text-secondary text-sm font-light mb-4">Islamabad's Premier Salon</div>
              <p className="text-primary text-xs font-bold tracking-widest uppercase mb-2">+92 347 7268791</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
