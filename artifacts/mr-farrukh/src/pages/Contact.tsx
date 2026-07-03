import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSubmitContact } from '@workspace/api-client-react';
import { MapPin, Phone, MessageCircle, Send } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email().optional().or(z.literal('')),
  service: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const submitContact = useSubmitContact();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: '',
      message: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await submitContact.mutateAsync({ data: values });
      setIsSuccess(true);
      form.reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full pt-32 pb-24 bg-[#050505] min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl text-white font-bold mb-6">Connect With Us</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto">
            Your journey to refinement begins here.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info & Map */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
            <div>
              <h3 className="font-serif text-3xl text-white mb-8">The Saloon</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#111] border border-primary/20 flex items-center justify-center shrink-0">
                    <MapPin className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm uppercase tracking-widest mb-2 font-semibold">Location</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Winston Mall, D-Block,<br/>
                      B-17, Islamabad, Pakistan
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#111] border border-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm uppercase tracking-widest mb-2 font-semibold">Direct Lines</h4>
                    <a href="tel:+923205814165" className="block text-muted-foreground text-sm hover:text-primary mb-1">0320-5814165</a>
                    <a href="tel:+923477268791" className="block text-muted-foreground text-sm hover:text-primary">0347-7268791</a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center shrink-0">
                    <FaWhatsapp className="text-[#25D366] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm uppercase tracking-widest mb-2 font-semibold">WhatsApp Concierge</h4>
                    <a href="https://wa.me/923477268791" target="_blank" rel="noreferrer" className="block text-muted-foreground text-sm hover:text-[#25D366]">
                      +92 347 7268791
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="aspect-[16/9] w-full border border-primary/20 p-2 bg-[#111]">
              <iframe 
                src="https://maps.google.com/maps?q=Winston+Mall+B-17+Islamabad&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                className="filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              ></iframe>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-[#0A0A0A] border border-primary/20 p-8 md:p-12 h-full">
              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <MessageCircle size={32} />
                  </div>
                  <h3 className="font-serif text-3xl text-white">Message Received</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. A member of our team will contact you shortly.</p>
                  <button onClick={() => setIsSuccess(false)} className="text-xs uppercase tracking-widest text-primary border-b border-primary pb-1">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-serif text-3xl text-white mb-8">Send an Inquiry</h3>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <input {...form.register('name')} placeholder="Full Name" className="w-full bg-[#111] border border-white/5 text-white p-4 text-sm focus:border-primary focus:outline-none transition-colors" />
                        {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                      </div>
                      <div>
                        <input {...form.register('phone')} placeholder="Phone Number" className="w-full bg-[#111] border border-white/5 text-white p-4 text-sm focus:border-primary focus:outline-none transition-colors" />
                        {form.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>}
                      </div>
                    </div>
                    <div>
                      <input {...form.register('email')} placeholder="Email Address (Optional)" className="w-full bg-[#111] border border-white/5 text-white p-4 text-sm focus:border-primary focus:outline-none transition-colors" />
                    </div>
                    <div>
                      <select {...form.register('service')} className="w-full bg-[#111] border border-white/5 text-white p-4 text-sm focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer">
                        <option value="">Select Topic</option>
                        <option value="Booking Inquiry">Booking Inquiry</option>
                        <option value="Service Information">Service Information</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <textarea {...form.register('message')} rows={5} placeholder="Your Message" className="w-full bg-[#111] border border-white/5 text-white p-4 text-sm focus:border-primary focus:outline-none transition-colors resize-none"></textarea>
                      {form.formState.errors.message && <p className="text-red-500 text-xs mt-1">{form.formState.errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={submitContact.isPending} className="w-full py-4 bg-primary text-black font-semibold text-sm uppercase tracking-widest hover:bg-accent transition-colors flex items-center justify-center gap-2">
                      {submitContact.isPending ? 'Sending...' : 'Send Message'} <Send size={16} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
