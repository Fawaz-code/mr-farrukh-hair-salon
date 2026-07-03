import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useListGallery } from '@workspace/api-client-react';
import { X, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from '@/components/ui/dialog';

export default function Gallery() {
  const { data: gallery, isLoading } = useListGallery({ query: { queryKey: ['gallery'] } });
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const categories = ['All', 'Haircuts', 'Facials', 'Beards', 'Interior'];

  // Mock data if API is empty
  const mockGallery = [
    { id: 1, title: 'Classic Fade', category: 'Haircuts', imageUrl: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=800' },
    { id: 2, title: 'Lux Interior', category: 'Interior', imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800' },
    { id: 3, title: 'Beard Sculpting', category: 'Beards', imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800' },
    { id: 4, title: 'Executive Styling', category: 'Haircuts', imageUrl: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&q=80&w=800' },
    { id: 5, title: 'Hydra Facial', category: 'Facials', imageUrl: 'https://images.unsplash.com/photo-1512496015851-a1c8ca60b134?auto=format&fit=crop&q=80&w=800' },
    { id: 6, title: 'Tools of Trade', category: 'Interior', imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800' },
  ];

  const items = gallery && gallery.length > 0 ? gallery : mockGallery;
  
  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="w-full pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-6">The Gallery</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto">
            A visual testament to our craft and environment.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs uppercase tracking-widest font-semibold pb-1 border-b-2 transition-colors ${
                filter === cat ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {isLoading ? (
              [1,2,3,4,5,6].map(i => <div key={i} className="bg-[#111] animate-pulse h-64 w-full break-inside-avoid"></div>)
            ) : (
              filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group break-inside-avoid overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="aspect-[3/4] md:aspect-auto w-full bg-[#111]">
                    {/* Using an img tag here but we fall back to a colored div if it fails or if not available */}
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-64 bg-[#1A1A1A] flex items-center justify-center ${item.imageUrl ? 'hidden' : ''}`}>
                      <span className="font-serif text-muted-foreground">{item.title}</span>
                    </div>
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 border border-primary/0 group-hover:border-primary/50">
                    <ZoomIn className="text-primary mb-4 w-8 h-8 transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                    <h3 className="text-white font-serif text-xl mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                    <p className="text-primary text-[10px] uppercase tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.category}</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Lightbox via Radix Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(o) => !o && setSelectedImage(null)}>
          <DialogPortal>
            <DialogOverlay className="bg-black/95 z-[100] backdrop-blur-sm" />
            <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-5xl border-none bg-transparent shadow-none p-0 outline-none">
              {selectedImage && (
                <div className="relative group">
                  <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 text-white hover:text-primary z-10">
                    <X size={32} />
                  </button>
                  <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full max-h-[80vh] object-contain border border-primary/20" />
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-8">
                    <h3 className="text-white font-serif text-3xl">{selectedImage.title}</h3>
                    <p className="text-primary text-sm uppercase tracking-widest mt-2">{selectedImage.category}</p>
                  </div>
                </div>
              )}
            </DialogContent>
          </DialogPortal>
        </Dialog>

      </div>
    </div>
  );
}
