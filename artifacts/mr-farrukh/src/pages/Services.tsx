import { motion } from 'framer-motion';
import { useListServices } from '@workspace/api-client-react';
import { Link } from 'wouter';

export default function Services() {
  const { data: services, isLoading } = useListServices();

  const categories = Array.from(new Set(services?.map(s => s.category) || []));

  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-24"
      >
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Our Services</h1>
        <p className="text-secondary text-lg font-light">Curated treatments delivered with uncompromising precision and care.</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-card rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-32">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="font-serif text-4xl mb-12 border-b border-white/10 pb-6 text-foreground">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services?.filter(s => s.category === category).map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 3) * 0.1 }}
                    className="glass-panel rounded-3xl p-8 flex flex-col group hover:border-primary/50 transition-colors"
                  >
                    <div className="h-56 rounded-2xl overflow-hidden mb-8 relative">
                      <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img 
                        src={service.imageUrl || "https://images.unsplash.com/photo-1620331311520-24c4d245d104?q=80&w=800"} 
                        alt={service.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="font-serif text-2xl mb-4 text-foreground">{service.name}</h3>
                    <p className="text-secondary text-sm flex-1 mb-8 leading-relaxed font-light">{service.description}</p>
                    <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/10">
                      <span className="text-lg font-medium text-foreground">{service.category}</span>
                      <Link href={`/book?service=${service.id}`} className="text-primary text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors">
                        Book Now
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}