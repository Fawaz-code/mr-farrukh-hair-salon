import { motion } from 'framer-motion';
import { useListStaff } from '@workspace/api-client-react';
import { Link } from 'wouter';

export default function Team() {
  const { data: staff, isLoading } = useListStaff();

  return (
    <div className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-[100dvh]">
      <div className="text-center mb-24">
        <h1 className="font-serif text-4xl md:text-6xl mb-6 text-gradient">Our Artisans</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto font-light">The master craftsmen behind Islamabad's finest looks.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[600px] bg-card rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {staff?.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group relative flex flex-col w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] max-w-sm"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-8 relative border border-white/5 shadow-xl">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-end justify-center p-8">
                  <Link href={`/book?staff=${member.id}`} className="bg-white text-black px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl text-center w-full">
                    Book This Stylist
                  </Link>
                </div>
                <img 
                  src={member.imageUrl || "https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=800"} 
                  alt={member.name}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                />
              </div>
              <div className="text-center flex-1 flex flex-col">
                <h3 className="font-serif text-3xl text-foreground mb-2">{member.name}</h3>
                <p className="text-primary text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4">{member.role} • {member.experience}</p>
                <p className="text-secondary text-sm leading-relaxed font-light mb-6 flex-1">{member.bio}</p>
                
                {((member.specializations && member.specializations.length > 0) || (member.languages && member.languages.length > 0)) && (
                  <div className="pt-6 border-t border-white/10 space-y-4 mt-auto">
                    {member.specializations && member.specializations.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">Expertise</div>
                        <div className="flex flex-wrap justify-center gap-2">
                          {member.specializations.map(spec => (
                            <span key={spec} className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded-full text-secondary">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {member.languages && member.languages.length > 0 && (
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">Languages</div>
                        <div className="text-sm text-secondary font-light">
                          {member.languages.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
