import React, { useState, useMemo } from 'react';
import { Appointment, User, Service, Availability } from '../types';
import Calendar from './Calendar';
import { CalendarIcon, ClockIcon, UserIcon, BriefcaseIcon, CogIcon, PlusIcon, TrashIcon, CurrencyDollarIcon } from './Icons';

interface BusinessViewProps {
  appointments: Appointment[];
  business: User;
  onUpdateBusiness: (updatedBusiness: User) => void;
}

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const BusinessView: React.FC<BusinessViewProps> = ({ appointments, business, onUpdateBusiness }) => {
  const [activeTab, setActiveTab] = useState('schedule');
  
  // Schedule state
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  // Profile state
  const [businessName, setBusinessName] = useState(business.name);
  const [description, setDescription] = useState(business.description || '');
  const [services, setServices] = useState<Service[]>(business.services || []);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');


  // Availability state
  const [availability, setAvailability] = useState<Availability[]>(business.availability || []);

  const appointmentsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter(app => app.date.toDateString() === selectedDate.toDateString())
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, appointments]);

  const handleProfileSave = () => {
    onUpdateBusiness({ ...business, name: businessName, description, services });
    alert('Profile updated successfully!');
  };

  const handleAddService = () => {
    if (newServiceName.trim() && newServiceDesc.trim() && newServicePrice.trim()) {
      setServices([...services, { name: newServiceName, description: newServiceDesc, price: parseFloat(newServicePrice) }]);
      setNewServiceName('');
      setNewServiceDesc('');
      setNewServicePrice('');
    }
  };

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleAvailabilityChange = (day: string, field: keyof Availability, value: any) => {
    setAvailability(availability.map(avail => 
        avail.day === day ? { ...avail, [field]: value } : avail
    ));
  };

  const handleAvailabilitySave = () => {
    onUpdateBusiness({ ...business, availability });
    alert('Availability updated successfully!');
  };

  const renderSchedule = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <div>
        <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">Appointment Calendar</h3>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          appointments={appointments}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">
          Schedule for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
        </h3>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {appointmentsForSelectedDate.length > 0 ? (
            appointmentsForSelectedDate.map(app => (
              <div key={app.id} className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg shadow">
                <div className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400"><ClockIcon className="w-5 h-5" /><span>{app.time}</span></div>
                <div className="mt-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2"><UserIcon className="w-5 h-5" /><span>{app.customerName}</span></div>
                  <a href={`mailto:${app.customerEmail}`} className="text-sm text-slate-500 dark:text-slate-400 hover:underline">{app.customerEmail}</a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg p-10 flex flex-col items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="font-semibold">No appointments scheduled for this day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div>
        <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">Profile & Services</h3>
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Business Name</label>
                <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Business Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
                <h4 className="text-lg font-semibold mb-2 text-slate-700 dark:text-slate-200">Services</h4>
                <div className="space-y-2">
                    {services.map((service, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{service.name}</p>
                                    {service.price && <p className="font-semibold text-indigo-600 dark:text-indigo-400">${service.price.toFixed(2)}</p>}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{service.description}</p>
                            </div>
                            <button onClick={() => handleRemoveService(index)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" placeholder="Service Name" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        <div className="relative">
                           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <CurrencyDollarIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input type="number" placeholder="Price" value={newServicePrice} onChange={e => setNewServicePrice(e.target.value)} className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                    </div>
                    <input type="text" placeholder="Service Description" value={newServiceDesc} onChange={e => setNewServiceDesc(e.target.value)} className="block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                    <button onClick={handleAddService} className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900"><PlusIcon className="w-5 h-5"/>Add Service</button>
                </div>
            </div>
        </div>
        <div className="mt-8 text-right">
            <button onClick={handleProfileSave} className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700">Save Profile</button>
        </div>
    </div>
  );
  
  const renderAvailability = () => (
    <div>
        <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">Set Weekly Availability</h3>
        <div className="space-y-4">
            {availability.map(avail => (
                <div key={avail.day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="md:col-span-1 flex items-center gap-3">
                        <input type="checkbox" checked={avail.enabled} onChange={e => handleAvailabilityChange(avail.day, 'enabled', e.target.checked)} className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500"/>
                        <label className="font-semibold text-slate-800 dark:text-slate-100">{avail.day}</label>
                    </div>
                    <div className="md:col-span-3 grid grid-cols-2 gap-4">
                        <input type="time" value={avail.startTime} onChange={e => handleAvailabilityChange(avail.day, 'startTime', e.target.value)} disabled={!avail.enabled} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md disabled:opacity-50"/>
                        <input type="time" value={avail.endTime} onChange={e => handleAvailabilityChange(avail.day, 'endTime', e.target.value)} disabled={!avail.enabled} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md disabled:opacity-50"/>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-8 text-right">
            <button onClick={handleAvailabilitySave} className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700">Save Availability</button>
        </div>
    </div>
  );

  const TabButton = ({ id, label, icon }) => (
    <button onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${activeTab === id ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
        <TabButton id="schedule" label="Schedule" icon={<CalendarIcon className="w-5 h-5"/>} />
        <TabButton id="profile" label="Profile & Services" icon={<BriefcaseIcon className="w-5 h-5"/>} />
        <TabButton id="availability" label="Availability" icon={<CogIcon className="w-5 h-5"/>} />
      </div>
      
      {activeTab === 'schedule' && renderSchedule()}
      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'availability' && renderAvailability()}
    </div>
  );
};

export default BusinessView;