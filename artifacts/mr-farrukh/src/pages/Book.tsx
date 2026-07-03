import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateAppointment, useListServices } from '@workspace/api-client-react';
import { CheckCircle2, ChevronRight, Calendar, Clock, User } from 'lucide-react';

export default function Book() {
  const [step, setStep] = useState(1);
  const { data: services } = useListServices();
  const createAppointment = useCreateAppointment();
  
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  const selectedService = services?.find(s => s.name === formData.service);

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    createAppointment.mutate({
      data: {
        service: formData.service,
        date: formData.date,
        time: formData.time,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        notes: formData.notes || undefined
      }
    }, {
      onSuccess: () => {
        setStep(4);
      }
    });
  };

  const handleWhatsApp = () => {
    const msg = `Hi Mr Farrukh, I would like to confirm my booking for ${formData.service} on ${formData.date} at ${formData.time}. My name is ${formData.name}.`;
    window.open(`https://wa.me/923477268791?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM"];

  return (
    <div className="pt-40 pb-24 px-6 max-w-4xl mx-auto w-full min-h-screen">
      <div className="text-center mb-20">
        <h1 className="font-serif text-5xl md:text-7xl mb-6">Reserve Your Time</h1>
        <p className="text-secondary text-lg font-light">Secure your appointment for a premium grooming experience.</p>
      </div>

      <div className="glass-panel rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
        {/* Progress bar */}
        <div className="flex justify-between items-center mb-16 relative z-10">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="flex flex-col items-center relative z-10 bg-background/50 backdrop-blur-sm rounded-full p-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= num ? 'bg-primary text-white shadow-[0_0_20px_rgba(28,78,216,0.5)]' : 'bg-white/5 text-secondary border border-white/10'}`}>
                {step > num ? <CheckCircle2 size={24} /> : num}
              </div>
            </div>
          ))}
          <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 h-px bg-white/10 -z-10" />
          <div className="absolute top-1/2 -translate-y-1/2 left-8 h-px bg-primary transition-all duration-700 ease-in-out -z-10 shadow-[0_0_10px_rgba(28,78,216,0.5)]" style={{ width: `${(step - 1) * 33.33}%` }} />
        </div>

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                <h2 className="font-serif text-3xl mb-8 text-foreground text-center">Select a Service</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                  {services?.map(service => (
                    <button
                      key={service.id}
                      onClick={() => { setFormData({...formData, service: service.name}); handleNext(); }}
                      className={`text-left p-6 rounded-2xl border transition-all duration-300 ${formData.service === service.name ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(28,78,216,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
                    >
                      <h3 className="font-serif text-xl text-foreground mb-2">{service.name}</h3>
                      <p className="text-sm text-secondary font-light">{service.category}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-10">
                <h2 className="font-serif text-3xl mb-8 text-foreground text-center">Choose Date & Time</h2>
                
                <div className="max-w-xl mx-auto space-y-10">
                  <div>
                    <label className="text-xs font-bold tracking-widest uppercase text-secondary mb-4 flex items-center gap-3"><Calendar size={18} className="text-primary"/> Select Date</label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-lg text-foreground focus:outline-none focus:border-primary transition-colors"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <AnimatePresence>
                    {formData.date && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="text-xs font-bold tracking-widest uppercase text-secondary mb-4 flex items-center gap-3"><Clock size={18} className="text-primary"/> Select Time</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              onClick={() => setFormData({...formData, time})}
                              className={`py-4 rounded-xl text-sm font-medium transition-all duration-300 ${formData.time === time ? 'bg-primary text-white shadow-[0_0_15px_rgba(28,78,216,0.3)]' : 'bg-white/5 border border-white/10 text-secondary hover:border-white/30 hover:bg-white/10'}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-4 pt-8">
                    <button onClick={handleBack} className="px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase glass-panel text-foreground hover:bg-white/10 transition-colors">Back</button>
                    <button 
                      onClick={handleNext} 
                      disabled={!formData.date || !formData.time}
                      className="flex-1 bg-primary text-white px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(28,78,216,0.3)] transition-all"
                    >
                      Continue <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-8 max-w-2xl mx-auto">
                <h2 className="font-serif text-3xl mb-8 text-foreground text-center flex items-center justify-center gap-3"><User size={28} className="text-primary"/> Contact Details</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-secondary mb-3">Full Name</label>
                      <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-secondary mb-3">Phone</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-secondary mb-3">Email (Optional)</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary transition-colors" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-secondary mb-3">Special Requests</label>
                    <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-foreground focus:outline-none focus:border-primary resize-none transition-colors" />
                  </div>
                </div>

                <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl mt-8">
                  <h4 className="font-serif text-xl text-primary mb-4">Booking Summary</h4>
                  <div className="space-y-2">
                    <p className="text-secondary text-sm flex justify-between"><span>Service:</span> <span className="text-foreground font-medium">{selectedService?.name}</span></p>
                    <p className="text-secondary text-sm flex justify-between"><span>Date:</span> <span className="text-foreground font-medium">{formData.date}</span></p>
                    <p className="text-secondary text-sm flex justify-between"><span>Time:</span> <span className="text-foreground font-medium">{formData.time}</span></p>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={handleBack} className="px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase glass-panel text-foreground hover:bg-white/10 transition-colors">Back</button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={!formData.name || !formData.phone || createAppointment.isPending}
                    className="flex-1 bg-primary text-white px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase disabled:opacity-50 hover:bg-primary/90 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(28,78,216,0.4)] transition-all"
                  >
                    {createAppointment.isPending ? 'Processing...' : 'Confirm Booking'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 space-y-8 max-w-md mx-auto">
                <div className="w-32 h-32 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                  <CheckCircle2 size={64} />
                </div>
                <h2 className="font-serif text-4xl text-foreground">Request Received</h2>
                <p className="text-secondary text-lg font-light leading-relaxed">Your booking request has been submitted successfully. Please confirm via WhatsApp to finalize your appointment.</p>
                
                <div className="pt-10">
                  <button 
                    onClick={handleWhatsApp}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(5,150,105,0.4)] flex items-center justify-center gap-3 transition-all"
                  >
                    Confirm on WhatsApp
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}