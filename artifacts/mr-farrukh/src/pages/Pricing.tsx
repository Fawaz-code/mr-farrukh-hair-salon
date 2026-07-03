import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useListPricing } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Search, ChevronDown } from 'lucide-react';

const HAIR_CATEGORIES = [
  'HAIR', 'STYLES', 'BEARD', 'BEARD COLORING', 'TREATMENTS', 'TEXTURE SERVICES', 'PERM SERVICES', 'HAIR COLORING'
];
const SKIN_BODY_CATEGORIES = [
  'FACIALS', 'POLISHER', 'MASSAGE', 'NAIL CARE', 'GROOMING', 'WAX'
];

export default function Pricing() {
  const { data: pricingItems, isLoading } = useListPricing();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (cat: string) => {
    setExpandedSections(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredItems = useMemo(() => {
    if (!pricingItems) return [];
    let items = pricingItems;
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

  const renderSection = (items: NonNullable<typeof pricingItems>, categories: string[], title: string) => {
    if (!items || items.length === 0) return null;
    
    const grouped = categories.reduce((acc, cat) => {
      const catItems = items.filter(i => i.category === cat);
      if (catItems.length > 0) acc[cat] = catItems;
      return acc;
    }, {} as Record<string, NonNullable<typeof pricingItems>>);

    if (Object.keys(grouped).length === 0) return null;

    return (
      <div className="mb-24">
        <h2 className="font-serif text-4xl md:text-5xl mb-12 text-gradient tracking-wide text-center">{title}</h2>
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category} className="glass-panel rounded-3xl overflow-hidden border border-white/10">
              <button 
                onClick={() => toggleSection(category)}
                className="w-full flex items-center justify-between p-8 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <h3 className="font-serif text-2xl tracking-widest text-foreground">{category}</h3>
                <ChevronDown className={`transform transition-transform duration-300 text-secondary ${expandedSections[category] ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {expandedSections[category] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-8 pt-0 space-y-4">
                      <div className="w-full h-px bg-white/10 mb-8" />
                      {catItems.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between group py-4 border-b border-white/5 last:border-0">
                          <div className="flex-1 pr-8">
                            <div className="flex items-center gap-4">
                              <h4 className="text-lg font-medium text-foreground">{item.name}</h4>
                              {item.popular && (
                                <span className="px-3 py-1 rounded text-[10px] font-bold tracking-widest bg-primary/20 text-primary border border-primary/30 uppercase">
                                  Popular
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-8 mt-4 sm:mt-0">
                            <div className="flex items-end gap-2">
                              <span className="text-xs font-bold tracking-widest uppercase text-secondary pb-1">PKR</span>
                              <span className="font-serif text-3xl text-foreground">{item.price.toLocaleString()}</span>
                            </div>
                            
                            <Link href={`/book?service=${item.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(28,78,216,0.3)]">
                              Book
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const allCategories = [...HAIR_CATEGORIES, ...SKIN_BODY_CATEGORIES];

  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto w-full min-h-screen">
      <div className="text-center mb-20">
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Investment in Self</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto font-light">Transparent pricing for world-class grooming experiences.</p>
      </div>

      <div className="mb-16 space-y-8">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text" 
            placeholder="Search services..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full glass-panel border border-white/20 rounded-full py-5 pl-14 pr-8 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors text-lg"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${activeCategory === null ? 'bg-primary text-white shadow-[0_0_15px_rgba(28,78,216,0.3)]' : 'glass-panel text-secondary hover:text-foreground'}`}
          >
            All
          </button>
          {allCategories.filter(cat => pricingItems?.some(i => i.category === cat)).map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-colors ${activeCategory === cat ? 'bg-primary text-white shadow-[0_0_15px_rgba(28,78,216,0.3)]' : 'glass-panel text-secondary hover:text-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-card rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {renderSection(hairItems, HAIR_CATEGORIES, "Hair Services")}
          {renderSection(skinItems, SKIN_BODY_CATEGORIES, "Skin & Body")}
        </>
      )}
    </div>
  );
}