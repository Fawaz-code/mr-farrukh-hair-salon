import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useListPricing } from '@workspace/api-client-react';
import { Search } from 'lucide-react';
import { Link } from 'wouter';

export default function Pricing() {
  const { data: pricingData, isLoading } = useListPricing({ query: { queryKey: ['pricing'] } });
  const [activeTab, setActiveTab] = useState('Hair');
  const [search, setSearch] = useState('');

  const categories = ['Hair', 'Skin', 'Massage', 'Wax', 'Nails', 'Coloring', 'Treatments'];

  // Mock data fallback if API is empty
  const mockPricing = useMemo(() => [
    { id: 1, category: 'Hair', name: 'Signature Haircut', price: 2500, popular: true },
    { id: 2, category: 'Hair', name: 'Kids Haircut', price: 1500 },
    { id: 3, category: 'Hair', name: 'Beard Trimming & Styling', price: 1000 },
    { id: 4, category: 'Skin', name: 'Hydra Facial', price: 8500, popular: true },
    { id: 5, category: 'Skin', name: 'Dermacos Facial', price: 4500 },
    { id: 6, category: 'Massage', name: 'Full Upper Body', price: 3000 },
    { id: 7, category: 'Massage', name: 'Head & Shoulder', price: 1500 },
  ], []);

  const items = pricingData && pricingData.length > 0 ? pricingData : mockPricing;

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesTab = item.category.toLowerCase().includes(activeTab.toLowerCase());
      return search ? matchesSearch : matchesTab;
    });
  }, [items, activeTab, search]);

  return (
    <div className="w-full pt-32 pb-24 bg-[#050505] min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-6">Investment in Self</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto">
            Transparent pricing for our premium services. No hidden costs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111] border border-primary/20 text-white rounded-none py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 text-sm font-sans"
          />
        </div>

        {/* Tabs */}
        {!search && (
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 text-xs uppercase tracking-widest font-semibold transition-all border ${
                  activeTab === cat 
                    ? 'border-primary bg-primary text-black' 
                    : 'border-white/10 text-muted-foreground hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* List */}
        <div className="bg-[#0A0A0A] border border-primary/10 p-2 md:p-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-[#111] animate-pulse"></div>)}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="space-y-2">
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-white/5 hover:bg-[#111] transition-colors gap-4"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-serif text-lg flex items-center gap-3">
                      {item.name}
                      {item.popular && (
                        <span className="text-[9px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-sm border border-primary/20">
                          Popular
                        </span>
                      )}
                    </span>
                    {search && <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{item.category}</span>}
                  </div>
                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-primary font-sans">
                      <span className="text-xs uppercase tracking-widest mr-1 opacity-70">PKR</span>
                      <span className="text-xl font-bold">{item.price.toLocaleString()}</span>
                    </div>
                    <Link href={`/book?service=${encodeURIComponent(item.name)}`} className="text-xs uppercase tracking-widest border border-primary/30 text-white px-4 py-2 hover:bg-primary hover:text-black transition-colors">
                      Book
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No services found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
