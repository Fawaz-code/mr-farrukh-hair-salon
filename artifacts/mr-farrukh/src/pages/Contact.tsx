import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubmitContact } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  const submitContact = useSubmitContact();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "Message Sent", description: "We will get back to you shortly." });
        setFormData({ name: '', email: '', phone: '', message: '' });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="text-center mb-24">
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Get in Touch</h1>
        <p className="text-secondary text-lg max-w-2xl mx-auto font-light">We look forward to welcoming you to our salon.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="font-serif text-4xl mb-10 text-foreground">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-10 rounded-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-secondary mb-3">Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-secondary mb-3">Phone</label>
                <input 
                  type="tel" required
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-secondary mb-3">Email</label>
              <input 
                type="email" required
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-secondary mb-3">Message</label>
              <textarea 
                required rows={5}
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            <button 
              type="submit" disabled={submitContact.isPending}
              className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase transition-all w-full md:w-auto disabled:opacity-50 shadow-[0_0_20px_rgba(28,78,216,0.3)]"
            >
              {submitContact.isPending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-16">
          <div>
            <h2 className="font-serif text-4xl mb-10 text-foreground">Visit Us</h2>
            <div className="space-y-8 glass-panel p-10 rounded-3xl">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2 uppercase tracking-widest text-sm">Location</h3>
                  <p className="text-secondary leading-relaxed font-light">Ground Floor, Winston Mall,<br/>D-Block, B-17, Islamabad</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2 uppercase tracking-widest text-sm">Phone</h3>
                  <p className="text-secondary font-light">0320-5814165<br/>0347-7268791 (WhatsApp)</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-2 uppercase tracking-widest text-sm">Email</h3>
                  <p className="text-secondary font-light">info@mrfarrukhsaloon.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] rounded-3xl overflow-hidden glass-panel relative p-2">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3318.5029314480574!2d72.8228308!3d33.682974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfa19ab46014cd%3A0xcda8d0113f044d03!2sB-17%20Islamabad!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
              width="100%" height="100%" style={{ border: 0, borderRadius: '1.5rem' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              className="filter invert contrast-100 opacity-80"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}