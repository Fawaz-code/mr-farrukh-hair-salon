import { Link } from 'wouter';
import { Facebook, Instagram, MapPin, Phone, MessageCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-[#050505] pt-20 pb-10 border-t border-primary/20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div>
            <div className="font-serif text-2xl font-bold tracking-wider text-primary mb-4">
              MR FARRUKH
              <span className="block text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-sans mt-1">Hair Saloon</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-sans">
              Islamabad's leading luxury salon for ladies and gentlemen. Where exceptional grooming meets unparalleled service in a truly premium environment.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg text-white mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-4 text-sm text-muted-foreground uppercase tracking-widest">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/team" className="hover:text-primary transition-colors">The Team</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/book" className="hover:text-primary transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-white mb-6 tracking-wide">Contact Us</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span>Winston Mall, D-Block,<br/>B-17, Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <a href="tel:+923205814165" className="hover:text-primary transition-colors">0320-5814165</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-primary shrink-0" />
                <a href="tel:+923477268791" className="hover:text-primary transition-colors">0347-7268791</a>
              </li>
              <li className="flex items-center gap-3">
                <FaWhatsapp size={18} className="text-primary shrink-0" />
                <a href="https://wa.me/923477268791" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">+92 347 7268791</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg text-white mb-6 tracking-wide">Working Hours</h3>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Mon - Sat</span>
                <span className="text-white">10:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Sunday</span>
                <span className="text-white">11:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-primary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} Mr Farrukh Hair Saloon. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
