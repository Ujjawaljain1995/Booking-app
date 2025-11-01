
import React from 'react';
import { Appointment } from '../types';

interface TimeSlotPickerProps {
  selectedDate: Date;
  onTimeSelect: (time: string) => void;
  appointments: Appointment[];
}

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
];

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ selectedDate, onTimeSelect, appointments }) => {
  const bookedTimes = appointments
    .filter(app => app.date.toDateString() === selectedDate.toDateString())
    .map(app => app.time);

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
        Available times for {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {timeSlots.map(time => {
          const isBooked = bookedTimes.includes(time);
          return (
            <button
              key={time}
              disabled={isBooked}
              onClick={() => onTimeSelect(time)}
              className={`p-3 text-center font-semibold rounded-lg transition-colors duration-200
                ${isBooked 
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed' 
                  : 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-700 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white'
                }`}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
   