import { motion } from 'framer-motion';
import { useListStaff } from '@workspace/api-client-react';

export default function Team() {
  const { data: staff, isLoading } = useListStaff();

  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="text-center mb-24">
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Our Artisans</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto font-light">The master craftsmen behind Islamabad's finest looks.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[500px] bg-card rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {staff?.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-8 relative">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img 
                  src={member.imageUrl || "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=800"} 
                  alt={member.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-3xl text-foreground mb-2">{member.name}</h3>
                <p className="text-primary text-xs font-bold tracking-widest uppercase mb-4">{member.role}</p>
                <p className="text-secondary text-sm leading-relaxed font-light line-clamp-3">{member.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}