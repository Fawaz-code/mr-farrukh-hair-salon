import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateAppointment } from '@workspace/api-client-react';
import { Calendar, Check, ChevronRight, Clock, User, Scissors } from 'lucide-react';
import { format, addDays } from 'date-fns';

const formSchema = z.object({
  service: z.string().min(1, 'Please select a service'),
  stylist: z.string().optional(),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email().optional().or(z.literal('')),
  notes: z.string().optional()
});

export default function Book() {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const createAppointment = useCreateAppointment();

  // URL params logic if any
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('service');
    if (s) {
      form.setValue('service', s);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: '',
      stylist: 'Any Stylist',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '',
      name: '',
      phone: '',
      email: '',
      notes: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createAppointment.mutateAsync({ data: values });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  const nextStep = async () => {
    const fields = step === 1 ? ['service', 'stylist'] as const
                 : step === 2 ? ['date', 'time'] as const
                 : [];
    
    const valid = await form.trigger(fields);
    if (valid) setStep(s => s + 1);
  };

  const services = ['Signature Haircut', 'Hair & Beard Combo', 'Hydra Facial', 'Full Body Massage', 'Hair Coloring', 'Bridal/Party Grooming'];
  const times = ['10:00 AM', '11:00 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'];
  const dates = Array.from({length: 7}).map((_, i) => addDays(new Date(), i));

  if (isSuccess) {
    return (
      <div className="w-full min-h-screen pt-32 pb-24 bg-black flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#111] border border-primary/30 p-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <Check size={40} />
          </div>
          <h2 className="font-serif text-3xl text-white mb-4">Reservation Confirmed</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Your appointment has been secured. Our concierge will contact you shortly to confirm the details.
          </p>
          <a 
            href={`https://wa.me/923477268791?text=Hi, I just booked an appointment for ${form.getValues('service')} on ${form.getValues('date')} at ${form.getValues('time')}. Name: ${form.getValues('name')}`}
            target="_blank" rel="noreferrer"
            className="block w-full py-4 bg-[#25D366] text-white text-sm uppercase tracking-widest font-semibold hover:bg-[#128C7E] transition-colors"
          >
            Confirm on WhatsApp
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-24 bg-[#050505] min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">Secure Your Session</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-[0.2em]">Step into perfection.</p>
        </div>

        {/* Progress */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-[#1A1A1A] z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] bg-primary z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[1,2,3].map(i => (
            <div key={i} className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors ${
              step >= i ? 'bg-primary border-primary text-black' : 'bg-[#111] border-[#1A1A1A] text-muted-foreground'
            }`}>
              {step > i ? <Check size={16} /> : <span className="font-serif text-sm font-bold">{i}</span>}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-[#0A0A0A] border border-primary/20 p-6 md:p-12 shadow-2xl relative">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary"></div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3"><Scissors className="text-primary"/> Select Service</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map(s => (
                      <div 
                        key={s}
                        onClick={() => form.setValue('service', s)}
                        className={`p-4 border cursor-pointer transition-all ${
                          form.watch('service') === s ? 'border-primary bg-primary/5 text-primary' : 'border-[#1A1A1A] text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        <span className="text-sm uppercase tracking-widest">{s}</span>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.service && <p className="text-red-500 text-xs mt-2">{form.formState.errors.service.message}</p>}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3"><Calendar className="text-primary"/> Date & Time</h3>
                  
                  <div className="mb-8 overflow-x-auto pb-4 custom-scrollbar">
                    <div className="flex gap-4 w-max">
                      {dates.map((d, i) => {
                        const dateStr = format(d, 'yyyy-MM-dd');
                        return (
                          <div 
                            key={i}
                            onClick={() => form.setValue('date', dateStr)}
                            className={`flex flex-col items-center justify-center p-4 min-w-[80px] border cursor-pointer transition-all ${
                              form.watch('date') === dateStr ? 'border-primary bg-primary text-black' : 'border-[#1A1A1A] text-muted-foreground hover:border-primary/30'
                            }`}
                          >
                            <span className="text-xs uppercase tracking-widest mb-1">{format(d, 'EEE')}</span>
                            <span className="font-serif text-2xl font-bold">{format(d, 'd')}</span>
                            <span className="text-[10px] uppercase tracking-widest">{format(d, 'MMM')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {times.map(t => (
                      <div 
                        key={t}
                        onClick={() => form.setValue('time', t)}
                        className={`p-3 text-center border cursor-pointer transition-all ${
                          form.watch('time') === t ? 'border-primary bg-primary/10 text-primary' : 'border-[#1A1A1A] text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        <span className="text-xs uppercase tracking-widest flex items-center justify-center gap-2"><Clock size={12}/>{t}</span>
                      </div>
                    ))}
                  </div>
                  {(form.formState.errors.date || form.formState.errors.time) && <p className="text-red-500 text-xs mt-4">Please select both date and time.</p>}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="font-serif text-2xl text-white mb-6 flex items-center gap-3"><User className="text-primary"/> Personal Details</h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Full Name *</label>
                        <input {...form.register('name')} className="w-full bg-[#111] border border-[#1A1A1A] text-white p-4 focus:border-primary focus:outline-none transition-colors" placeholder="John Doe" />
                        {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Phone Number *</label>
                        <input {...form.register('phone')} className="w-full bg-[#111] border border-[#1A1A1A] text-white p-4 focus:border-primary focus:outline-none transition-colors" placeholder="0300 1234567" />
                        {form.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Email Address (Optional)</label>
                      <input {...form.register('email')} className="w-full bg-[#111] border border-[#1A1A1A] text-white p-4 focus:border-primary focus:outline-none transition-colors" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Special Requests (Optional)</label>
                      <textarea {...form.register('notes')} rows={3} className="w-full bg-[#111] border border-[#1A1A1A] text-white p-4 focus:border-primary focus:outline-none transition-colors" placeholder="Any specific requirements..."></textarea>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="pt-8 border-t border-[#1A1A1A] flex justify-between">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 text-xs uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
                  Go Back
                </button>
              ) : <div></div>}

              {step < 3 ? (
                <button type="button" onClick={nextStep} className="px-8 py-3 bg-primary text-black text-xs uppercase tracking-widest font-semibold hover:bg-accent transition-colors flex items-center gap-2">
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={createAppointment.isPending} className="px-10 py-3 bg-primary text-black text-xs uppercase tracking-widest font-semibold hover:bg-accent transition-all shadow-[0_0_20px_rgba(201,168,76,0.3)] disabled:opacity-50">
                  {createAppointment.isPending ? 'Confirming...' : 'Confirm Booking'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
