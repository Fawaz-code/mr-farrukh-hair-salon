import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useListTestimonials, useListServices } from '@workspace/api-client-react';

export default function Home() {
  const { data: testimonials } = useListTestimonials();
  const { data: services } = useListServices();

  const stats = [
    { label: 'Years of Excellence', value: '15+' },
    { label: 'Happy Clients', value: '10k+' },
    { label: 'Expert Stylists', value: '12' },
    { label: 'Premium Services', value: '50+' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 z-10" />
          <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop" alt="Luxury Salon" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-block px-6 py-2 mb-8 border border-white/20 rounded-full glass-panel"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-secondary">Islamabad's Premier Salon</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight mb-8 text-foreground"
          >
            Where Precision Meets <br/><span className="text-gradient">Elegance</span>.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-12 font-light"
          >
            Experience an unhurried, elevated grooming journey designed for the modern gentleman and lady.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/book" className="bg-primary text-white px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary/90 transition-all w-full sm:w-auto shadow-[0_0_30px_rgba(28,78,216,0.4)]">
              Reserve Your Time
            </Link>
            <Link href="/services" className="glass-panel text-white px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-all w-full sm:w-auto">
              Explore Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/5 bg-card relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="text-center"
            >
              <div className="font-serif text-4xl md:text-6xl text-primary mb-3">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-6xl mb-6">Our Atelier Services</h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">Meticulously crafted treatments tailored to your unique style.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services?.slice(0, 3).map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="group relative h-[450px] rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
              <img src={service.imageUrl || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=2000"} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{service.category}</div>
                <h3 className="font-serif text-3xl mb-3 text-foreground">{service.name}</h3>
                <p className="text-secondary text-sm line-clamp-2">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/services" className="inline-block glass-panel text-foreground px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
            View All Services
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-card relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl mb-20 text-center">Words of Distinction</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials?.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="glass-panel p-10 rounded-3xl"
              >
                <div className="flex text-primary mb-8 gap-1">
                  {[...Array(t.rating)].map((_, idx) => (
                    <svg key={idx} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-secondary leading-relaxed mb-8 font-light italic">"{t.text}"</p>
                <div className="font-serif text-xl text-foreground">— {t.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}