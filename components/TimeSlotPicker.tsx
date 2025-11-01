import React from 'react';
import { Appointment, Availability } from '../types';

interface TimeSlotPickerProps {
  selectedDate: Date;
  onTimeSelect: (time: string) => void;
  appointments: Appointment[];
  availability: Availability[];
}

const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const generateTimeSlots = (startTimeStr: string, endTimeStr: string) => {
    if (!startTimeStr || !endTimeStr) return [];
    
    const slots = [];
    const startDate = new Date(`1970-01-01T${startTimeStr}:00`);
    const endDate = new Date(`1970-01-01T${endTimeStr}:00`);

    let currentTime = startDate;
    while (currentTime < endDate) {
        slots.push(formatTime(currentTime));
        currentTime = new Date(currentTime.getTime() + 60 * 60 * 1000); // Add 1 hour
    }
    return slots;
};

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ selectedDate, onTimeSelect, appointments, availability }) => {
  const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dayAvailability = availability.find(a => a.day === dayOfWeek && a.enabled);

  const timeSlots = dayAvailability 
    ? generateTimeSlots(dayAvailability.startTime, dayAvailability.endTime)
    : [];
    
  const bookedTimes = appointments
    .filter(app => app.date.toDateString() === selectedDate.toDateString())
    .map(app => app.time);

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
        Available times for {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
      </h3>
      {timeSlots.length > 0 ? (
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
      ) : (
        <div className="text-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg p-6">
          <p>No available slots for this day.</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;