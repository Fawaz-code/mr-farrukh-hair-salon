import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useListTestimonials } from '@workspace/api-client-react';

const FEATURED_SERVICES = [
  {
    id: 1,
    label: 'Hair & Styling',
    title: 'Precision Haircuts',
    desc: 'Tailored cuts designed around your face shape, hair texture, and personal style — finished with expert styling.',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1400&fit=crop',
    href: '/services',
  },
  {
    id: 2,
    label: 'Facials & Skin',
    title: 'Hydra Facial',
    desc: 'Advanced multi-step facial cleansing, extraction, and hydration for instant, lasting radiance.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1400&fit=crop',
    href: '/services',
  },
  {
    id: 3,
    label: 'Color & Texture',
    title: 'Keratin & Balayage',
    desc: 'Professional keratin treatments and hand-painted color that transform and last months.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1400&fit=crop',
    href: '/services',
  },
];

const stats = [
  { label: 'Years of Excellence', value: '15+' },
  { label: 'Happy Clients', value: '10k+' },
  { label: 'Expert Stylists', value: '12' },
  { label: 'Premium Services', value: '50+' },
];

export default function Home() {
  const { data: testimonials } = useListTestimonials();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/60 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30 z-10" />
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop"
            alt="Luxury Salon"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-20">
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
            className="font-serif text-4xl md:text-6xl lg:text-8xl leading-tight mb-8 text-foreground"
          >
            Where Precision Meets <br /><span className="text-gradient">Elegance</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-base md:text-xl text-secondary max-w-2xl mx-auto mb-12 font-light px-4"
          >
            Experience an unhurried, elevated grooming journey designed for the modern gentleman and lady.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-md mx-auto sm:max-w-none"
          >
            <Link href="/book" className="bg-primary text-white px-8 md:px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-primary/90 transition-all w-full sm:w-auto shadow-[0_0_30px_rgba(28,78,216,0.4)] h-12 flex items-center justify-center">
              Reserve Your Time
            </Link>
            <Link href="/services" className="glass-panel text-white px-8 md:px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-all w-full sm:w-auto h-12 flex items-center justify-center">
              Explore Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-24 border-y border-white/5 bg-card relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="text-center"
            >
              <div className="font-serif text-3xl md:text-6xl text-primary mb-2 md:mb-3">{stat.value}</div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-serif text-4xl md:text-6xl mb-4 md:mb-6">Our Atelier Services</h2>
          <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto font-light">Meticulously crafted treatments tailored to your unique style.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {FEATURED_SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="group relative h-[380px] md:h-[460px] rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10 z-10" />
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8 z-20">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">{service.label}</div>
                <h3 className="font-serif text-2xl md:text-3xl mb-3 text-foreground">{service.title}</h3>
                <p className="text-secondary text-sm leading-relaxed font-light mb-5 line-clamp-2">{service.desc}</p>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary hover:text-foreground transition-colors"
                >
                  Learn More
                  <span className="inline-block w-6 h-px bg-primary group-hover:w-10 transition-all duration-300" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <Link href="/services" className="inline-flex items-center justify-center h-12 glass-panel text-foreground px-10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors border border-white/10">
            View All Services
          </Link>
        </div>
      </section>

      {/* Client Reviews */}
      <section className="py-24 md:py-32 bg-card relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14 md:mb-18">
            <h2 className="font-serif text-4xl md:text-6xl mb-4">Client Reviews</h2>
            <p className="text-secondary text-base font-light">What our guests say about their experience</p>
          </div>

          {/* Mobile: horizontal scroll / Desktop: 3-col grid */}
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 snap-x snap-mandatory gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:snap-none md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonials?.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.7 }}
                className="glass-panel rounded-3xl p-7 md:p-8 min-w-[82vw] sm:min-w-[300px] w-full snap-center shrink-0 flex flex-col border border-white/8 hover:border-white/15 transition-colors"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, idx) => (
                    <svg
                      key={idx}
                      className={`w-4 h-4 ${idx < t.rating ? 'text-primary fill-current' : 'text-white/15 fill-current'}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-secondary leading-relaxed font-light italic text-sm flex-1">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-white/8 pt-5 mt-6">
                  <img
                    src={t.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="font-serif text-base text-foreground leading-tight">{t.name}</div>
                    {t.service && (
                      <div className="text-[10px] uppercase tracking-widest text-primary mt-0.5">{t.service}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
