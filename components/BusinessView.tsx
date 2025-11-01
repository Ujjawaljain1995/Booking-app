
import React, { useState, useMemo } from 'react';
import { Appointment } from '../types';
import Calendar from './Calendar';
import { ClockIcon, UserIcon } from './Icons';

interface BusinessViewProps {
  appointments: Appointment[];
}

const BusinessView: React.FC<BusinessViewProps> = ({ appointments }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const appointmentsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter(app => app.date.toDateString() === selectedDate.toDateString())
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, appointments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">Business Schedule</h2>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          appointments={appointments}
        />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">
          Appointments for {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
        </h2>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {appointmentsForSelectedDate.length > 0 ? (
            appointmentsForSelectedDate.map(app => (
              <div key={app.id} className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg shadow">
                <div className="flex items-center justify-between font-semibold text-indigo-600 dark:text-indigo-400">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5" />
                    <span>{app.time}</span>
                  </div>
                </div>
                <div className="mt-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                     <UserIcon className="w-5 h-5" />
                     <span>{app.customerName}</span>
                  </div>
                  <a href={`mailto:${app.customerEmail}`} className="text-sm text-slate-500 dark:text-slate-400 hover:underline">{app.customerEmail}</a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg p-10 flex flex-col items-center justify-center h-full">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="font-semibold">No appointments scheduled for this day.</p>
              <p className="text-sm mt-1">Select another date to view its schedule.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessView;
   