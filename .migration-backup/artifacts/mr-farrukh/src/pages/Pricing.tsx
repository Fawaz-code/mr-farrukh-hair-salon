import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useListPricing } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Search, ChevronDown, Sparkles } from 'lucide-react';

const HAIR_CATEGORIES = ['HAIR', 'STYLES', 'BEARD', 'BEARD COLORING', 'TREATMENTS', 'TEXTURE SERVICES', 'PERM SERVICES', 'HAIR COLORING'];
const SKIN_BODY_CATEGORIES = ['FACIALS', 'POLISHER', 'MASSAGE', 'NAIL CARE', 'GROOMING', 'WAX'];

const CATEGORY_DISPLAY: Record<string, string> = {
  'HAIR': 'Hair',
  'STYLES': 'Styles',
  'BEARD': 'Beard',
  'BEARD COLORING': 'Beard Coloring',
  'TREATMENTS': 'Treatments',
  'TEXTURE SERVICES': 'Texture Services',
  'PERM SERVICES': 'Perm Services',
  'HAIR COLORING': 'Hair Coloring',
  'FACIALS': 'Facials',
  'POLISHER': 'Polisher',
  'MASSAGE': 'Massage',
  'NAIL CARE': 'Nail Care',
  'GROOMING': 'Party Grooming',
  'WAX': 'Waxing',
};

type PricingItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  popular?: boolean | null;
};

export default function Pricing() {
  const { data: pricingItems, isLoading } = useListPricing();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (cat: string) => {
    setExpandedSections(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredItems = useMemo(() => {
    if (!pricingItems) return [] as PricingItem[];
    let items: PricingItem[] = pricingItems;
    if (search) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (activeCategory) {
      items = items.filter(item => item.category === activeCategory);
    }
    return items;
  }, [pricingItems, search, activeCategory]);

  const hairItems = filteredItems.filter(item => HAIR_CATEGORIES.includes(item.category));
  const skinItems = filteredItems.filter(item => SKIN_BODY_CATEGORIES.includes(item.category));

  const renderSection = (items: PricingItem[], categories: string[], title: string, idx: number) => {
    const grouped = categories.reduce((acc, cat) => {
      const catItems = items.filter(i => i.category === cat);
      if (catItems.length > 0) acc[cat] = catItems;
      return acc;
    }, {} as Record<string, PricingItem[]>);

    if (Object.keys(grouped).length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: idx * 0.1 }}
        className="mb-20 md:mb-28"
      >
        {/* Section header */}
        <div className="flex items-center gap-6 mb-10 md:mb-14">
          <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent" />
          <h2 className="font-serif text-3xl md:text-5xl text-foreground whitespace-nowrap">{title}</h2>
          <div className="flex-1 h-px bg-gradient-to-l from-primary/40 to-transparent" />
        </div>

        <div className="space-y-4">
          {Object.entries(grouped).map(([category, catItems], catIdx) => {
            const isOpen = !!expandedSections[category];
            return (
              <div
                key={category}
                className="rounded-2xl md:rounded-3xl overflow-hidden border border-white/8 transition-colors hover:border-white/15"
              >
                {/* Accordion header */}
                <button
                  onClick={() => toggleSection(category)}
                  className="w-full flex items-center justify-between px-6 md:px-8 py-5 md:py-6 group"
                  style={{ background: isOpen ? 'rgba(28,78,216,0.08)' : 'rgba(255,255,255,0.03)' }}
                >
                  <div className="flex items-center gap-4 md:gap-5">
                    <span className="font-mono text-[10px] md:text-xs text-primary/60 font-bold tracking-widest w-6 text-right shrink-0">
                      {String(catIdx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-xl md:text-2xl text-foreground text-left">
                      {CATEGORY_DISPLAY[category] ?? category}
                    </h3>
                    <span className="text-[10px] md:text-xs text-secondary font-light hidden sm:block">
                      {catItems.length} service{catItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary/20 border-primary/30 rotate-180' : 'bg-white/5 group-hover:bg-white/10'}`}>
                    <ChevronDown size={15} className="text-secondary" />
                  </div>
                </button>

                {/* Accordion body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                        <div className="space-y-0">
                          {catItems.map((item, itemIdx) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: itemIdx * 0.04, duration: 0.3 }}
                              className="group/item flex items-center justify-between py-4 md:py-5 border-b border-white/5 last:border-0 gap-4"
                            >
                              {/* Left: name + badge */}
                              <div className="flex items-center gap-3 min-w-0">
                                <h4 className="text-sm md:text-base text-foreground font-medium leading-snug truncate">{item.name}</h4>
                                {item.popular && (
                                  <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest bg-primary/15 text-primary border border-primary/25 uppercase">
                                    <Sparkles size={8} /> Popular
                                  </span>
                                )}
                              </div>

                              {/* Right: price + book */}
                              <div className="flex items-center gap-4 md:gap-6 shrink-0">
                                <div className="text-right">
                                  <span className="font-serif text-xl md:text-2xl text-foreground">{item.price.toLocaleString()}</span>
                                  <span className="text-[10px] text-secondary font-light ml-1">PKR</span>
                                </div>
                                <Link
                                  href="/book"
                                  className="hidden sm:flex items-center justify-center px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover/item:opacity-100 transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary whitespace-nowrap"
                                >
                                  Book
                                </Link>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  const allCategories = [...HAIR_CATEGORIES, ...SKIN_BODY_CATEGORIES];

  return (
    <div className="min-h-screen w-full">
      {/* Hero */}
      <div className="pt-36 md:pt-44 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-bold tracking-widest uppercase"
          >
            <Sparkles size={12} /> Transparent Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl mb-5 text-foreground"
          >
            Investment in Self
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-secondary text-base md:text-lg font-light max-w-xl mx-auto"
          >
            World-class grooming experiences at honest prices.
          </motion.p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-14 space-y-6">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search any service..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full glass-panel border border-white/15 rounded-full py-4 md:py-5 pl-13 pr-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
          />
        </div>

        <div className="flex overflow-x-auto pb-2 gap-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${activeCategory === null ? 'bg-primary text-white shadow-[0_0_15px_rgba(28,78,216,0.3)]' : 'glass-panel text-secondary hover:text-foreground border border-white/10'}`}
          >
            All
          </button>
          {allCategories.filter(cat => pricingItems?.some(i => i.category === cat)).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-primary text-white shadow-[0_0_15px_rgba(28,78,216,0.3)]' : 'glass-panel text-secondary hover:text-foreground border border-white/10'}`}
            >
              {CATEGORY_DISPLAY[cat] ?? cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-24">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white/3 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {renderSection(hairItems, HAIR_CATEGORIES, 'Hair Services', 0)}
            {renderSection(skinItems, SKIN_BODY_CATEGORIES, 'Skin & Body', 1)}
            {hairItems.length === 0 && skinItems.length === 0 && (
              <div className="text-center py-20 text-secondary">
                <p className="font-serif text-2xl mb-3">No results found</p>
                <p className="text-sm font-light">Try a different search term or clear your filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
