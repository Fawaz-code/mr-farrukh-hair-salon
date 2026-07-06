import { useState } from 'react';
import { useListPricing, useListAppointments, useListServices, useListGallery, useListStaff, useListContactMessages } from '@workspace/api-client-react';
import { motion } from 'framer-motion';

const TABS = ['Appointments', 'Services', 'Pricing', 'Gallery', 'Staff', 'Messages'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="pt-40 pb-24 px-6 max-w-7xl mx-auto w-full min-h-screen">
      <div className="mb-12 border-b border-white/10 flex overflow-x-auto hide-scrollbar gap-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-colors relative ${activeTab === tab ? 'text-primary' : 'text-secondary hover:text-foreground'}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="admin-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div className="glass-panel rounded-[2rem] p-10 min-h-[600px] border border-white/10 shadow-2xl">
        {activeTab === 'Appointments' && <AppointmentsTab />}
        {activeTab === 'Services' && <ServicesTab />}
        {activeTab === 'Pricing' && <PricingTab />}
        {activeTab === 'Gallery' && <GalleryTab />}
        {activeTab === 'Staff' && <StaffTab />}
        {activeTab === 'Messages' && <MessagesTab />}
      </div>
    </div>
  );
}

function AppointmentsTab() {
  const { data } = useListAppointments();
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-3xl text-foreground">Recent Appointments</h2>
      </div>
      <div className="grid gap-4">
        {data?.map(app => (
          <div key={app.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-colors">
            <div>
              <p className="font-serif text-xl text-foreground mb-1">{app.name}</p>
              <p className="text-sm text-secondary font-light">{app.date} at {app.time} — <span className="text-primary">{app.phone}</span></p>
            </div>
            <div className="text-right">
              <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${app.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                {app.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesTab() {
  const { data } = useListServices();
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-3xl text-foreground">Manage Services</h2>
        <button className="bg-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Add Service</button>
      </div>
      <div className="grid gap-4">
        {data?.map(s => (
          <div key={s.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-colors">
            <div className="flex gap-6 items-center">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/50">
                <img src={s.imageUrl ?? undefined} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-serif text-xl text-foreground block mb-1">{s.name}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-primary">{s.category}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="text-secondary hover:text-foreground text-sm">Edit</button>
              <button className="text-destructive hover:text-red-400 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingTab() {
  const { data } = useListPricing();
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-3xl text-foreground">Manage Pricing</h2>
        <button className="bg-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Add Item</button>
      </div>
      <div className="grid gap-4">
        {data?.map(p => (
          <div key={p.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-colors">
            <div>
              <span className="font-serif text-xl text-foreground block mb-1">{p.name} {p.popular && <span className="text-xs ml-2 text-primary uppercase font-sans">★ Popular</span>}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-secondary">{p.category}</span>
            </div>
            <div className="flex items-center gap-8">
              <span className="font-serif text-2xl text-foreground">PKR {p.price.toLocaleString()}</span>
              <div className="flex gap-3">
                <button className="text-secondary hover:text-foreground text-sm">Edit</button>
                <button className="text-destructive hover:text-red-400 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab() {
  const { data } = useListGallery();
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-3xl text-foreground">Manage Gallery</h2>
        <button className="bg-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Upload</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data?.map(g => (
          <div key={g.id} className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative group">
            <img src={g.imageUrl} className="w-full h-full object-cover" alt="Gallery" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
               <button className="text-white hover:text-primary text-sm font-bold uppercase tracking-widest">Edit</button>
               <button className="text-destructive hover:text-red-400 text-sm font-bold uppercase tracking-widest">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffTab() {
  const { data } = useListStaff();
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-3xl text-foreground">Manage Staff</h2>
        <button className="bg-primary text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest">Add Member</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.map(s => (
          <div key={s.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex gap-6 items-center hover:bg-white/10 transition-colors">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10">
              <img src={s.imageUrl ?? undefined} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <span className="font-serif text-xl text-foreground block mb-1">{s.name}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{s.role}</span>
            </div>
            <div className="flex gap-3">
               <button className="text-secondary hover:text-foreground text-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab() {
  const { data } = useListContactMessages();
  return (
    <div className="space-y-8">
      <h2 className="font-serif text-3xl text-foreground">Contact Messages</h2>
      <div className="grid gap-6">
        {data?.map(m => (
          <div key={m.id} className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
              <div>
                <span className="font-serif text-xl text-foreground block mb-1">{m.name}</span>
                <span className="text-sm text-primary">{m.email} • {m.phone}</span>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-secondary bg-white/5 px-3 py-1 rounded-full">{new Date(m.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-secondary leading-relaxed font-light">{m.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}