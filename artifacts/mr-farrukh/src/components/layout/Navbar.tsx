import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Team', path: '/team' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-primary/20 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="font-serif text-2xl font-bold tracking-wider text-primary group-hover:text-accent transition-colors">
            MR FARRUKH
            <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-sans mt-1">Hair Saloon</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} className={`text-sm uppercase tracking-widest hover:text-primary transition-colors ${location === link.path ? 'text-primary' : 'text-foreground/80'}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/book" className="px-6 py-3 bg-primary text-black font-semibold text-sm uppercase tracking-widest hover:bg-accent transition-colors hover:shadow-[0_0_20px_rgba(201,168,76,0.4)]">
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-primary" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-primary/20 flex flex-col p-4 gap-4 md:hidden"
        >
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} className="text-sm uppercase tracking-widest py-3 border-b border-white/5 hover:text-primary transition-colors text-center">
              <span onClick={() => setIsMobileMenuOpen(false)}>{link.label}</span>
            </Link>
          ))}
          <Link href="/book" className="px-6 py-4 bg-primary text-black font-semibold text-sm uppercase tracking-widest text-center mt-2">
            <span onClick={() => setIsMobileMenuOpen(false)}>Book Now</span>
          </Link>
        </motion.div>
      )}
    </header>
  );
}
