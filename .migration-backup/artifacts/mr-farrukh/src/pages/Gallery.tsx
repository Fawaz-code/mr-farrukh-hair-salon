import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useListGallery } from '@workspace/api-client-react';
import type { GalleryItem } from '@workspace/api-client-react';
import { X, ZoomIn } from 'lucide-react';

const CATEGORIES = ['All', 'Hair Transformations', 'Hair Coloring', 'Hair Styling', 'Facials', 'Salon Interior', 'Team at Work'];

export default function Gallery() {
  const { data: galleryItems, isLoading } = useListGallery();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems: GalleryItem[] = (galleryItems ?? []).filter(item =>
    activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <div className="min-h-[100dvh] pt-36 md:pt-44 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero */}
      <div className="text-center mb-14 md:mb-18">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block px-5 py-2 mb-6 rounded-full border border-white/15 glass-panel"
        >
          <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">Portfolio</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl mb-4 text-gradient"
        >
          The Atelier Gallery
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-secondary text-base md:text-lg max-w-2xl mx-auto font-light"
        >
          A curated showcase of transformations, craftsmanship, and artistry from our atelier.
        </motion.p>
      </div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex overflow-x-auto pb-4 mb-10 md:mb-14 gap-2.5 justify-start md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap shrink-0 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(28,78,216,0.35)] border border-primary'
                : 'glass-panel text-secondary hover:text-foreground border border-white/10 hover:border-white/25'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`bg-white/3 rounded-2xl md:rounded-3xl animate-pulse break-inside-avoid ${i % 3 === 0 ? 'h-96' : i % 2 === 0 ? 'h-64' : 'h-80'}`}
            />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5"
          >
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="relative group rounded-2xl md:rounded-3xl overflow-hidden break-inside-avoid cursor-pointer border border-white/5 hover:border-white/20 transition-colors"
                onClick={() => setSelectedImage(item)}
              >
                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-primary/90 text-white text-[9px] font-bold tracking-widest uppercase backdrop-blur-sm">
                    Featured
                  </div>
                )}

                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.caption ?? item.title ?? 'Gallery'}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                    {item.title && (
                      <h3 className="text-white font-serif text-lg leading-tight mb-1">{item.title}</h3>
                    )}
                    {item.caption && (
                      <p className="text-white/70 text-xs font-light line-clamp-2">{item.caption}</p>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center">
                    <ZoomIn size={16} className="text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-24 text-secondary">
          <p className="font-serif text-2xl mb-3">No photos in this category</p>
          <button onClick={() => setActiveCategory('All')} className="text-primary text-xs font-bold tracking-widest uppercase mt-2 hover:text-foreground transition-colors">
            View All
          </button>
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
          >
            {/* Close */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl w-full flex flex-col bg-[#0d1526] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10"
            >
              {/* Image area */}
              <div className="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title ?? 'Gallery'}
                  className="max-w-full max-h-[65vh] object-contain"
                />
              </div>

              {/* Info bar */}
              <div className="px-7 md:px-10 py-6 md:py-8 flex items-start justify-between gap-6">
                <div>
                  {selectedImage.category && (
                    <div className="text-[10px] font-bold tracking-widest uppercase text-primary mb-2">{selectedImage.category}</div>
                  )}
                  {selectedImage.title && (
                    <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-2">{selectedImage.title}</h3>
                  )}
                  {selectedImage.caption && (
                    <p className="text-secondary font-light text-sm leading-relaxed max-w-xl">{selectedImage.caption}</p>
                  )}
                </div>
                {selectedImage.featured && (
                  <span className="shrink-0 px-4 py-2 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-bold tracking-widest uppercase">
                    Featured
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
