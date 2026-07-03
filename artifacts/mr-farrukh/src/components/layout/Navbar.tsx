import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';

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

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass-panel rounded-full px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl tracking-widest text-foreground font-semibold">
          MR FARRUKH
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.path} href={link.path} className="relative group text-xs font-bold tracking-widest uppercase text-secondary hover:text-foreground transition-colors">
              {link.name}
              {location === link.path && (
                <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          ))}
        </nav>
        
        <Link href="/book" className="hidden md:block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(28,78,216,0.3)] hover:shadow-[0_0_30px_rgba(28,78,216,0.5)]">
          Reserve Time
        </Link>
      </div>
    </motion.header>
  );
}