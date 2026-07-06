import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-24 pb-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-serif text-3xl mb-6 text-gradient">Mr Farrukh Hair Saloon</h2>
          <p className="text-muted-foreground leading-relaxed max-w-md">
            Islamabad's premier luxury salon for ladies and gents. An unhurried, elevated, and precise grooming experience.
          </p>
        </div>
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-foreground mb-6">Explore</h3>
          <ul className="space-y-4">
            <li><Link href="/services" className="text-secondary hover:text-primary transition-colors">Services</Link></li>
            <li><Link href="/pricing" className="text-secondary hover:text-primary transition-colors">Pricing</Link></li>
            <li><Link href="/gallery" className="text-secondary hover:text-primary transition-colors">Gallery</Link></li>
            <li><Link href="/contact" className="text-secondary hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-foreground mb-6">Contact</h3>
          <ul className="space-y-4 text-secondary">
            <li>Ground Floor, Winston Mall</li>
            <li>D-Block, B-17, Islamabad</li>
            <li>0320-5814165</li>
            <li>0347-7268791</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mr Farrukh Hair Saloon. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/admin" className="hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}