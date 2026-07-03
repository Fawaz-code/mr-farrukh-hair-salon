import { motion } from 'framer-motion';
import { useListServices } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Clock, ChevronRight } from 'lucide-react';

export default function Services() {
  const { data: services, isLoading } = useListServices({ query: { queryKey: ['services'] } });

  const categories = ['Hair Services', 'Facials', 'Massage', 'Wax', 'Nail Care', 'Party Grooming'];

  const getServicesByCategory = (cat: string) => {
    if (!services) return [];
    return services.filter(s => s.category.toLowerCase() === cat.toLowerCase());
  };

  return (
    <div className="w-full pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-6">Our Services</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
              Curated treatments for the modern gentleman and lady. Masterful execution, imported products, complete relaxation.
            </p>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-[#111] animate-pulse border border-primary/10 rounded-sm"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-32">
            {categories.map((cat, i) => {
              const catServices = getServicesByCategory(cat);
              if (catServices.length === 0 && cat !== 'Party Grooming') {
                // If API is empty, show some dummy placeholders matching the prompt
                const dummies = cat === 'Hair Services' 
                  ? ['Hair Cut', 'Hair Styling', 'Beard Cleansing', 'Keratin']
                  : cat === 'Facials' ? ['Hydra Facial', 'Dermaclear'] : ['Signature Treatment'];
                
                catServices.push(...dummies.map((name, id) => ({
                  id, name, category: cat, description: 'Experience the ultimate luxury treatment tailored precisely to your needs.', duration: '45 mins'
                })) as any);
              }

              return (
                <motion.div 
                  key={cat}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div className="flex items-center gap-6 mb-12">
                    <h2 className="font-serif text-3xl md:text-4xl text-white">{cat}</h2>
                    <div className="h-[1px] bg-primary/30 flex-grow"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catServices.map((service, j) => (
                      <motion.div
                        key={service.id || j}
                        whileHover={{ y: -5 }}
                        className="group bg-[#0A0A0A] border border-primary/10 p-6 relative overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.1)]"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                          <span className="font-serif text-8xl text-primary font-bold">{j + 1}</span>
                        </div>
                        
                        <h3 className="font-serif text-xl text-white mb-3 relative z-10">{service.name}</h3>
                        <p className="text-muted-foreground text-sm mb-6 flex-grow relative z-10">
                          {service.description || 'Premium treatment using imported luxury products for flawless results.'}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 relative z-10">
                          {service.duration && (
                            <span className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                              <Clock size={14} className="text-primary" /> {service.duration}
                            </span>
                          )}
                          <Link href={`/book?service=${encodeURIComponent(service.name)}`} className="text-primary text-xs uppercase tracking-widest font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Book <ChevronRight size={14} />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
