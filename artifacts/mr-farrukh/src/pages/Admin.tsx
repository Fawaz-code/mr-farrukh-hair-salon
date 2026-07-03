import { useState } from 'react';
import { useListAppointments, useListContactMessages, useUpdateAppointment, useDeleteAppointment } from '@workspace/api-client-react';
import { Calendar, MessageSquare, Users, Image as ImageIcon, LayoutDashboard, Search, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Appointments');
  const { toast } = useToast();

  const { data: appointments, refetch: refetchAppts } = useListAppointments({ query: { queryKey: ['appointments'] } });
  const { data: messages } = useListContactMessages({ query: { queryKey: ['messages'] } });

  const updateAppointment = useUpdateAppointment();
  const deleteAppointment = useDeleteAppointment();

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateAppointment.mutateAsync({ id, data: { status } });
      refetchAppts();
      toast({ title: 'Status updated successfully' });
    } catch (e) {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await deleteAppointment.mutateAsync({ id });
      refetchAppts();
      toast({ title: 'Appointment deleted' });
    } catch(e) {
      toast({ title: 'Error deleting', variant: 'destructive' });
    }
  };

  const tabs = [
    { name: 'Appointments', icon: Calendar },
    { name: 'Messages', icon: MessageSquare },
    { name: 'Services', icon: LayoutDashboard },
    { name: 'Staff', icon: Users },
    { name: 'Gallery', icon: ImageIcon },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'Appointments':
        return (
          <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-[#1A1A1A] text-white uppercase tracking-widest text-[10px]">
                  <tr>
                    <th className="p-4">Date/Time</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {appointments?.map(apt => (
                    <tr key={apt.id} className="hover:bg-[#1A1A1A]/50">
                      <td className="p-4">
                        <div className="text-white font-medium">{apt.date}</div>
                        <div className="text-xs">{apt.time}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-white">{apt.name}</div>
                        <div className="text-xs">{apt.phone}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-primary">{apt.service}</div>
                        <div className="text-xs">{apt.stylist || 'Any'}</div>
                      </td>
                      <td className="p-4">
                        <select 
                          value={apt.status} 
                          onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                          className={`text-xs uppercase font-bold tracking-wider bg-transparent outline-none cursor-pointer ${
                            apt.status === 'pending' ? 'text-yellow-500' :
                            apt.status === 'confirmed' ? 'text-green-500' : 'text-red-500'
                          }`}
                        >
                          <option value="pending" className="bg-black text-white">Pending</option>
                          <option value="confirmed" className="bg-black text-white">Confirmed</option>
                          <option value="cancelled" className="bg-black text-white">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button onClick={() => handleDelete(apt.id)} className="text-red-500 hover:text-red-400 p-2">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!appointments?.length && (
                    <tr><td colSpan={5} className="p-8 text-center">No appointments found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Messages':
        return (
          <div className="grid gap-4">
            {messages?.map(msg => (
              <div key={msg.id} className="bg-[#111] border border-white/10 p-6 rounded-lg flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 shrink-0">
                  <div className="text-white font-bold mb-1">{msg.name}</div>
                  <div className="text-xs text-muted-foreground mb-1">{msg.phone}</div>
                  <div className="text-xs text-primary uppercase tracking-widest">{msg.service || 'General Inquiry'}</div>
                  <div className="text-[10px] mt-4">{format(new Date(msg.createdAt), 'MMM d, yyyy h:mm a')}</div>
                </div>
                <div className="flex-grow">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
            {!messages?.length && <div className="p-8 text-center bg-[#111] border border-white/10 rounded-lg">No messages found</div>}
          </div>
        );
      default:
        return (
          <div className="bg-[#111] border border-white/10 border-dashed rounded-lg p-12 text-center flex flex-col items-center justify-center">
            <LayoutDashboard size={48} className="text-primary/20 mb-4" />
            <h3 className="text-xl text-white mb-2">Management for {activeTab}</h3>
            <p className="text-muted-foreground text-sm">This module is part of the full CMS integration phase.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full pt-32 pb-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-bold mb-2">Command Center</h1>
            <p className="text-primary text-xs uppercase tracking-widest">Admin Dashboard</p>
          </div>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          {/* Sidebar */}
          <div className="bg-[#111] border border-white/10 p-4 rounded-lg h-max">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-colors ${
                    activeTab === tab.name 
                      ? 'bg-primary text-black font-semibold' 
                      : 'text-muted-foreground hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
