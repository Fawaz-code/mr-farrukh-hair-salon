import { motion } from 'framer-motion';
import { useListStaff } from '@workspace/api-client-react';
import { Link } from 'wouter';

export default function Team() {
  const { data: staff, isLoading } = useListStaff({ query: { queryKey: ['staff'] } });

  // Mock data if API is empty
  const mockStaff = [
    { id: 1, name: 'Mr Farrukh', role: 'Master Stylist & Founder', experience: '15+ Years', specializations: ['Executive Styling', 'Beard Sculpting'], imageUrl: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Ahmed', role: 'Senior Colorist', experience: '8 Years', specializations: ['Balayage', 'Keratin'], imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: 'Bilal', role: 'Skin Specialist', experience: '5 Years', specializations: ['Hydra Facial', 'Dermacos'], imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400' },
  ];

  const team = staff && staff.length > 0 ? staff : mockStaff;

  return (
    <div className="w-full pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-20">
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-6">The Masters</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
            Our artisans combine years of experience with unparalleled attention to detail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            [1,2,3].map(i => <div key={i} className="h-96 bg-[#111] animate-pulse border border-primary/20"></div>)
          ) : (
            team.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-[#0A0A0A] border border-primary/20 hover:border-primary/60 transition-colors overflow-hidden"
              >
                <div className="aspect-square bg-[#1A1A1A] relative overflow-hidden">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30 font-serif text-6xl">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  {/* Gold Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>

                <div className="p-8 -mt-20 relative z-10 text-center">
                  <span className="inline-block bg-primary text-black text-[9px] uppercase tracking-widest px-3 py-1 font-bold mb-4">
                    {member.experience}
                  </span>
                  <h3 className="font-serif text-3xl text-white mb-2">{member.name}</h3>
                  <p className="text-primary text-sm tracking-widest uppercase font-semibold mb-6">{member.role}</p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {member.specializations?.map(spec => (
                      <span key={spec} className="border border-white/10 text-muted-foreground text-[10px] uppercase tracking-wider px-2 py-1">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <Link href={`/book?stylist=${encodeURIComponent(member.name)}`} className="inline-block w-full py-3 border border-primary text-primary hover:bg-primary hover:text-black uppercase tracking-widest text-xs font-semibold transition-all">
                    Book with {member.name.split(' ')[0]}
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
