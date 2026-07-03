import { motion } from 'framer-motion';
import { useListGallery } from '@workspace/api-client-react';

export default function Gallery() {
  const { data: galleryItems, isLoading } = useListGallery();

  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="text-center mb-20">
        <h1 className="font-serif text-5xl md:text-7xl mb-6">The Atelier Gallery</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto font-light">A visual testament to our commitment to the craft.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`bg-card rounded-3xl animate-pulse ${i % 2 === 0 ? 'h-96' : 'h-64'}`} />
          ))}
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {galleryItems?.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 5) * 0.1 }}
              className="relative group rounded-3xl overflow-hidden break-inside-avoid"
            >
              <img src={item.imageUrl} alt={item.caption || 'Gallery Image'} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <p className="text-white font-medium text-lg tracking-wide">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}