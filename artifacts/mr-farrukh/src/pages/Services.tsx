import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Scissors, Sparkles, Leaf, Palette, Zap, Waves, Sun, Hand, Flame, Star, Crown } from 'lucide-react';

const CATEGORIES = [
  { name: 'Hair Services', icon: Scissors, description: 'Precision haircuts crafted to suit your face shape, lifestyle, and personal style — from classic cuts to contemporary transformations' },
  { name: 'Hair Styling', icon: Sparkles, description: 'From sleek blowouts to textured event looks, our stylists sculpt each strand with intention' },
  { name: 'Hair Treatments', icon: Leaf, description: 'Restorative protein doses, dandruff control, and shine-enhancement treatments to repair and revitalize' },
  { name: 'Hair Coloring', icon: Palette, description: "Expert color application — Revlon, L'Oréal, Keune, Garnier and more — tailored to your natural tone" },
  { name: 'Texture Services', icon: Zap, description: 'Botox and Keratin treatments that eliminate frizz and restore silk-smooth texture for months' },
  { name: 'Perm Services', icon: Waves, description: 'Long-lasting curl and wave definition using professional perming techniques' },
  { name: 'Facials', icon: Sparkles, description: 'From Hydra Facial to Thalgo and Janssen — advanced skin science delivered by certified therapists' },
  { name: 'Skin Care', icon: Sun, description: 'Polishers, masks, and medicated skin treatments personalized to your skin type' },
  { name: 'Massage', icon: Hand, description: 'Head, shoulder, back, and full upper body massage to melt away tension' },
  { name: 'Waxing', icon: Flame, description: 'Precise, gentle waxing for face and body — cheeks, forehead, neck, and full face' },
  { name: 'Nail Care', icon: Star, description: 'Professional manicure and pedicure with meticulous attention to detail' },
  { name: 'Party Grooming', icon: Crown, description: 'Complete pre-event cleansing, scrubbing, and grooming package to look and feel your absolute best' },
];

export default function Services() {
  return (
    <div className="w-full min-h-[100dvh]">
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <h1 className="font-serif text-4xl md:text-6xl mb-6 text-foreground text-gradient">The Art of Grooming</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto font-light mb-10 leading-relaxed">
            Curated treatments delivered with uncompromising precision and care. Explore our comprehensive portfolio of premium services designed to elevate your personal style.
          </p>
          <Link href="/book" className="inline-flex items-center justify-center bg-primary text-white px-10 h-14 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(28,78,216,0.4)]">
            Reserve Your Time
          </Link>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.1, duration: 0.6 }}
                className="glass-panel p-8 rounded-3xl flex flex-col group hover:-translate-y-2 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(28,78,216,0.15)]"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6 text-secondary group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-500">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl mb-4 text-foreground">{cat.name}</h3>
                <p className="text-secondary text-sm flex-1 mb-8 leading-relaxed font-light">{cat.description}</p>
                <div className="mt-auto pt-6 border-t border-white/5">
                  <Link href="/pricing" className="text-primary text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-2">
                    View Pricing
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
