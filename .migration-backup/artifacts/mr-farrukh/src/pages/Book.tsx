import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateAppointment, useListServices, useListStaff } from '@workspace/api-client-react';
import { CheckCircle2, ChevronRight, Calendar, User, MessageSquare, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Book() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const { data: services } = useListServices();
  const { data: staff } = useListStaff();
  const createAppointment = useCreateAppointment();

  const [formData, setFormData] = useState({
    service: '',
    staffId: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [bookingError, setBookingError] = useState(false);

  const selectedService = services?.find(s => s.name === formData.service);
  const selectedStaff = staff?.find(s => s.id.toString() === formData.staffId);

  const go = (n: number) => { setDirection(n); setStep(s => s + n); };

  const buildWhatsAppMessage = () => {
    const stylistLine = selectedStaff ? selectedStaff.name : 'Any Available Stylist';
    const lines = [
      '✂️ *New Appointment Request — Mr Farrukh Hair Saloon*',
      '',
      `*Service:* ${formData.service}`,
      `*Stylist:* ${stylistLine}`,
      `*Date:* ${formData.date}`,
      `*Time:* ${formData.time}`,
      `*Name:* ${formData.name}`,
      `*Phone:* ${formData.phone}`,
      formData.email ? `*Email:* ${formData.email}` : null,
      formData.notes ? `*Notes:* ${formData.notes}` : null,
      '',
      'Please confirm this appointment at your earliest convenience. Thank you!'
    ].filter(Boolean).join('\n');
    return lines;
  };

  const openWhatsApp = () => {
    const msg = buildWhatsAppMessage();
    window.open(`https://wa.me/923477268791?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleConfirm = () => {
    setBookingError(false);
    const stylistName = selectedStaff ? selectedStaff.name : 'Any Stylist';

    createAppointment.mutate(
      {
        data: {
          service: formData.service,
          stylist: stylistName,
          date: formData.date,
          time: formData.time,
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          notes: formData.notes || undefined,
        }
      },
      {
        onSuccess: () => {
          // Open WhatsApp immediately after confirmed DB save
          openWhatsApp();
          setDirection(1);
          setStep(10);
        },
        onError: () => {
          setBookingError(true);
        }
      }
    );
  };

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM',
    '07:00 PM', '08:00 PM'
  ];

  const groupedServices = useMemo(() => {
    if (!services) return {};
    return services.reduce((acc, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {} as Record<string, typeof services>);
  }, [services]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 40 : -40, opacity: 0 })
  };

  const progressPercent = Math.round(((step - 1) / 9) * 100);

  const NavButtons = ({
    disabled = false,
    isConfirm = false,
    showBack = true,
  }: {
    disabled?: boolean;
    isConfirm?: boolean;
    showBack?: boolean;
  }) => (
    <div className="flex flex-col gap-3 pt-8 mt-auto shrink-0">
      {bookingError && isConfirm && (
        <div className="flex items-center gap-2 text-red-400 text-xs font-medium bg-red-400/10 border border-red-400/20 rounded-2xl px-4 py-3">
          <AlertCircle size={14} className="shrink-0" />
          <span>Something went wrong saving your booking. Please try again.</span>
        </div>
      )}
      <div className="flex gap-3">
        {showBack && (
          <button
            onClick={() => { setBookingError(false); go(-1); }}
            className="flex items-center gap-2 px-5 sm:px-8 h-12 sm:h-14 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase glass-panel text-secondary hover:text-foreground hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
        <button
          onClick={isConfirm ? handleConfirm : () => go(1)}
          disabled={disabled || createAppointment.isPending}
          className="flex-1 bg-primary text-white h-12 sm:h-14 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(28,78,216,0.35)] transition-all"
        >
          {isConfirm ? (
            createAppointment.isPending ? 'Confirming...' : 'Confirm & Open WhatsApp'
          ) : (
            <>Continue <ChevronRight size={15} /></>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full min-h-[100dvh] flex flex-col">
      <div className="text-center mb-10 sm:mb-14 shrink-0">
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 text-gradient">Reserve Your Time</h1>
        <p className="text-secondary text-sm sm:text-base font-light">Secure your appointment for a premium grooming experience.</p>
      </div>

      <div className="glass-panel rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 relative shadow-2xl flex-1 flex flex-col border border-white/10">
        {step < 10 && (
          <div className="mb-8 sm:mb-10 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">Step {step} of 9</span>
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{progressPercent}%</span>
            </div>
            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(28,78,216,0.8)]"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        <div className="relative flex-1 flex flex-col min-h-0">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {/* Step 1 — Select Service */}
            {step === 1 && (
              <motion.div key="s1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="flex flex-col h-full space-y-5">
                <h2 className="font-serif text-2xl sm:text-3xl text-foreground text-center shrink-0">Select a Service</h2>
                <div className="flex-1 overflow-y-auto pr-1 space-y-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {Object.entries(groupedServices).map(([category, catServices]) => (
                    <div key={category}>
                      <h3 className="text-[10px] font-bold tracking-widest uppercase text-primary mb-3 pb-2 border-b border-white/5">{category}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {catServices.map(service => (
                          <button
                            key={service.id}
                            onClick={() => { setFormData(f => ({ ...f, service: service.name })); go(1); }}
                            className={`text-left p-4 rounded-2xl border transition-all duration-200 ${formData.service === service.name ? 'bg-primary/20 border-primary shadow-[0_0_12px_rgba(28,78,216,0.2)]' : 'bg-white/3 border-white/8 hover:border-white/20 hover:bg-white/8'}`}
                          >
                            <h4 className="font-serif text-lg text-foreground leading-tight">{service.name}</h4>
                            {service.duration && <p className="text-[11px] text-secondary mt-1 font-light">{service.duration}</p>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2 — Select Stylist */}
            {step === 2 && (
              <motion.div key="s2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="flex flex-col h-full space-y-5">
                <h2 className="font-serif text-2xl sm:text-3xl text-foreground text-center shrink-0">Choose a Stylist</h2>
                <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => { setFormData(f => ({ ...f, staffId: 'any' })); go(1); }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${formData.staffId === 'any' ? 'bg-primary/20 border-primary' : 'bg-white/3 border-white/8 hover:border-white/20 hover:bg-white/8'}`}
                    >
                      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-secondary shrink-0">
                        <User size={22} />
                      </div>
                      <div className="text-left">
                        <h4 className="font-serif text-xl text-foreground">Any Stylist</h4>
                        <p className="text-[11px] text-secondary font-light mt-0.5">Best available for your slot</p>
                      </div>
                    </button>
                    {staff?.map(member => (
                      <button
                        key={member.id}
                        onClick={() => { setFormData(f => ({ ...f, staffId: member.id.toString() })); go(1); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${formData.staffId === member.id.toString() ? 'bg-primary/20 border-primary' : 'bg-white/3 border-white/8 hover:border-white/20 hover:bg-white/8'}`}
                      >
                        <img
                          src={member.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'}
                          alt={member.name}
                          className="w-14 h-14 rounded-full object-cover shrink-0 border border-white/10"
                        />
                        <div className="text-left">
                          <h4 className="font-serif text-xl text-foreground leading-tight">{member.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-primary mt-1">{member.role}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <NavButtons disabled={!formData.staffId} />
              </motion.div>
            )}

            {/* Step 3 — Date */}
            {step === 3 && (
              <motion.div key="s3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="flex flex-col h-full max-w-sm mx-auto w-full">
                <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-foreground text-center">Pick a Date</h2>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-secondary mb-4 flex items-center gap-2 justify-center">
                      <Calendar size={14} className="text-primary" /> Select Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-base sm:text-lg text-foreground focus:outline-none focus:border-primary transition-colors text-center cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>
                <NavButtons disabled={!formData.date} />
              </motion.div>
            )}

            {/* Step 4 — Time */}
            {step === 4 && (
              <motion.div key="s4" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="flex flex-col h-full w-full">
                <h2 className="font-serif text-2xl sm:text-3xl mb-6 text-foreground text-center">Preferred Time</h2>
                <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => { setFormData(f => ({ ...f, time })); go(1); }}
                        className={`py-4 sm:py-5 rounded-2xl text-sm font-medium transition-all duration-200 border ${formData.time === time ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(28,78,216,0.3)]' : 'bg-white/5 border-white/8 text-secondary hover:border-white/20 hover:bg-white/10'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <NavButtons disabled={!formData.time} />
              </motion.div>
            )}

            {/* Step 5 — Name */}
            {step === 5 && (
              <motion.div key="s5" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="flex flex-col h-full max-w-sm mx-auto w-full">
                <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-foreground text-center">Your Name</h2>
                <div className="flex-1 flex flex-col justify-center">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-base sm:text-lg text-foreground focus:outline-none focus:border-primary transition-colors text-center"
                    autoFocus
                  />
                </div>
                <NavButtons disabled={!formData.name.trim()} />
              </motion.div>
            )}

            {/* Step 6 — Phone */}
            {step === 6 && (
              <motion.div key="s6" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="flex flex-col h-full max-w-sm mx-auto w-full">
                <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-foreground text-center">Phone Number</h2>
                <div className="flex-1 flex flex-col justify-center gap-3">
                  <input
                    type="tel"
                    placeholder="03XX XXXXXXX"
                    value={formData.phone}
                    onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-base sm:text-lg text-foreground focus:outline-none focus:border-primary transition-colors text-center"
                    autoFocus
                  />
                  <p className="text-center text-xs text-secondary font-light">We'll use this to confirm your appointment</p>
                </div>
                <NavButtons disabled={!formData.phone.trim()} />
              </motion.div>
            )}

            {/* Step 7 — Email */}
            {step === 7 && (
              <motion.div key="s7" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="flex flex-col h-full max-w-sm mx-auto w-full">
                <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-foreground text-center">Email Address</h2>
                <div className="flex-1 flex flex-col justify-center gap-3">
                  <input
                    type="email"
                    placeholder="Optional"
                    value={formData.email}
                    onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-base sm:text-lg text-foreground focus:outline-none focus:border-primary transition-colors text-center"
                    autoFocus
                  />
                  <p className="text-center text-xs text-secondary font-light">Skip if you prefer not to share</p>
                </div>
                <NavButtons />
              </motion.div>
            )}

            {/* Step 8 — Notes */}
            {step === 8 && (
              <motion.div key="s8" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="flex flex-col h-full max-w-sm mx-auto w-full">
                <h2 className="font-serif text-2xl sm:text-3xl mb-8 text-foreground text-center">Special Requests</h2>
                <div className="flex-1 flex flex-col justify-center">
                  <textarea
                    rows={5}
                    placeholder="Any specific requirements or preferences? (Optional)"
                    value={formData.notes}
                    onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-base text-foreground focus:outline-none focus:border-primary resize-none transition-colors"
                    autoFocus
                  />
                </div>
                <NavButtons />
              </motion.div>
            )}

            {/* Step 9 — Review */}
            {step === 9 && (
              <motion.div key="s9" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="flex flex-col h-full max-w-lg mx-auto w-full">
                <h2 className="font-serif text-2xl sm:text-3xl mb-6 text-foreground text-center">Review Booking</h2>
                <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="space-y-3">
                    {[
                      { label: 'Service', value: formData.service },
                      { label: 'Stylist', value: selectedStaff ? selectedStaff.name : 'Any Stylist' },
                      { label: 'Date', value: formData.date },
                      { label: 'Time', value: formData.time },
                      { label: 'Name', value: formData.name },
                      { label: 'Phone', value: formData.phone },
                      ...(formData.email ? [{ label: 'Email', value: formData.email }] : []),
                      ...(formData.notes ? [{ label: 'Notes', value: formData.notes }] : []),
                    ].map(row => (
                      <div key={row.label} className="flex items-start justify-between py-4 border-b border-white/5 gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary shrink-0 pt-0.5 w-20">{row.label}</span>
                        <span className="font-serif text-lg text-foreground text-right leading-snug">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-xs text-secondary font-light mt-6 leading-relaxed">
                    Clicking confirm will open WhatsApp with your booking details pre-filled — ready to send directly to our team.
                  </p>
                </div>
                <NavButtons isConfirm />
              </motion.div>
            )}

            {/* Step 10 — Confirmed */}
            {step === 10 && (
              <motion.div
                key="s10"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col h-full items-center justify-center text-center py-8 max-w-sm mx-auto w-full"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-24 h-24 sm:w-28 sm:h-28 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                >
                  <CheckCircle2 size={44} />
                </motion.div>

                <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">Booking Submitted</h2>
                <p className="text-secondary text-sm sm:text-base font-light leading-relaxed mb-10">
                  WhatsApp should have opened with your booking details. If it didn't, tap the button below to send again.
                </p>

                <div className="w-full space-y-4">
                  <button
                    onClick={openWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#22C55E] text-white h-14 rounded-full text-xs font-bold tracking-widest uppercase shadow-[0_0_30px_rgba(37,211,102,0.25)] flex items-center justify-center gap-3 transition-all"
                  >
                    <MessageSquare size={18} /> Send on WhatsApp
                  </button>
                  <button
                    onClick={() => { setStep(1); setFormData({ service: '', staffId: '', date: '', time: '', name: '', phone: '', email: '', notes: '' }); }}
                    className="w-full glass-panel text-secondary hover:text-foreground h-12 rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors"
                  >
                    New Booking
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
