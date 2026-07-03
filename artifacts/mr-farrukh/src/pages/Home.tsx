import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { useListServices, useListTestimonials, useListStaff } from '@workspace/api-client-react';
import { Scissors, Star, ChevronRight, Check } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

export default function Home() {
  const { data: services } = useListServices({ query: { queryKey: ['services'] } });
  const { data: testimonials } = useListTestimonials({ query: { queryKey: ['testimonials'] } });
  
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-black">
        {/* Abstract Particle Background using CSS/Framer Motion */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-black to-black"></div>
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: Math.random() * 2,
                opacity: Math.random()
              }}
              animate={{
                y: [null, -100],
                opacity: [null, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-white font-bold leading-tight mb-6"
          >
            Experience Luxury. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Experience Perfection.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground font-sans uppercase tracking-[0.2em] mb-12"
          >
            Islamabad's Leading Luxury Saloon for Ladies & Gents
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/book" className="w-full sm:w-auto px-8 py-4 bg-primary text-black font-semibold text-sm uppercase tracking-widest hover:bg-accent transition-all shadow-[0_0_30px_rgba(201,168,76,0.3)]">
              Book Appointment
            </Link>
            <a href="https://wa.me/923477268791" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 bg-black/40 backdrop-blur-md border border-primary/30 text-white font-semibold text-sm uppercase tracking-widest hover:bg-primary/10 transition-all">
              Book on WhatsApp
            </a>
            <Link href="/services" className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-semibold text-sm uppercase tracking-widest hover:border-white transition-all">
              Explore Services
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-primary to-transparent"></div>
        </motion.div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-[#0A0A0A] relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-primary"></div>
                <span className="text-primary uppercase tracking-widest text-xs font-semibold">Our Story</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                A Legacy of <br/><span className="text-primary text-shadow-glow">Unmatched Elegance</span>
              </h2>
              <p className="text-muted-foreground font-serif text-xl italic leading-relaxed">
                "We don't just cut hair; we sculpt confidence. Every client who walks through our doors experiences a ritual of pure refinement."
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Since our inception, Mr Farrukh Hair Saloon has redefined the grooming landscape in Islamabad. Situated in the prestigious Winston Mall, B-17, we combine international standards with bespoke luxury.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-primary/20">
                <div>
                  <div className="text-4xl font-serif text-white mb-2">8+</div>
                  <div className="text-xs uppercase tracking-widest text-primary">Years Experience</div>
                </div>
                <div>
                  <div className="text-4xl font-serif text-white mb-2">5k+</div>
                  <div className="text-xs uppercase tracking-widest text-primary">Happy Clients</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] bg-[#111] border border-primary/20 p-2"
            >
              {/* Replace with actual high quality interior shot later, using abstract design for now */}
              <div className="w-full h-full bg-[#1A1A1A] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
                <Scissors size={120} strokeWidth={0.5} className="text-primary/20" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary p-6 text-black flex flex-col justify-center shadow-2xl">
                <h3 className="font-serif text-2xl font-bold mb-2">Premium</h3>
                <p className="text-xs uppercase tracking-widest opacity-80">Imported Products Only</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Teaser */}
      <section className="py-24 bg-black relative border-y border-primary/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-primary"></div>
              <span className="text-primary uppercase tracking-widest text-xs font-semibold">The Rituals</span>
              <div className="w-12 h-[1px] bg-primary"></div>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Our Signature Services</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Curated grooming experiences delivered with masterful precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Hair Services', 'Facials', 'Massage', 'Nail Care', 'Wax', 'Party Grooming'].map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 border border-primary/10 bg-[#0A0A0A] hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(201,168,76,0.15)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                <h3 className="font-serif text-2xl text-white mb-4 group-hover:text-primary transition-colors">{cat}</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-primary" /> Premium execution
                  </li>
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check size={14} className="text-primary" /> Expert consultation
                  </li>
                </ul>
                <Link href="/services" className="inline-flex items-center gap-2 text-primary text-xs uppercase tracking-widest font-semibold group-hover:gap-4 transition-all">
                  Explore <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing" className="inline-block border-b border-primary text-white hover:text-primary transition-colors pb-1 uppercase tracking-widest text-sm font-semibold">
              View Full Price List
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0A0A0A] overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold">Client Experiences</h2>
          </div>
          
          <div className="embla" ref={emblaRef}>
            <div className="embla__container flex">
              {(testimonials || [1,2,3,4,5]).map((t: any, i: number) => (
                <div key={t.id || i} className="embla__slide flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-6">
                  <div className="bg-[#111] border border-primary/20 p-8 h-full flex flex-col relative">
                    <div className="absolute -top-4 -right-4 opacity-10">
                      <Star size={100} fill="currentColor" className="text-primary" />
                    </div>
                    <div className="flex gap-1 text-primary mb-6">
                      {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-muted-foreground italic text-sm leading-relaxed mb-8 flex-grow">
                      "{t.text || 'An absolute masterclass in grooming. The attention to detail is something I have never experienced anywhere else in Islamabad.'}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-serif font-bold text-lg">
                        {t.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h4 className="text-white font-serif tracking-wide">{t.name || 'Anonymous Client'}</h4>
                        <p className="text-[10px] text-primary uppercase tracking-widest">{t.service || 'Signature Haircut'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl text-black font-bold mb-8">Ready for Perfection?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/book" className="px-10 py-4 bg-black text-white font-semibold text-sm uppercase tracking-widest hover:bg-[#1A1A1A] transition-colors border border-transparent hover:border-black/50">
              Book Your Spot
            </Link>
            <a href="https://wa.me/923477268791" target="_blank" rel="noreferrer" className="px-10 py-4 bg-transparent border-2 border-black text-black font-semibold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
