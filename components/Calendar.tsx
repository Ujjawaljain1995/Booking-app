
import React, { useState } from 'react';
import { Appointment } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  appointments: Appointment[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, appointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startOfMonth.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));

  const appointmentDates = new Set(appointments.map(app => app.date.toDateString()));
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const dates = [];
  let day = new Date(startDate);
  while (day <= endDate) {
    dates.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayClasses = (date: Date) => {
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = selectedDate?.toDateString() === date.toDateString();
    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
    const isPast = date < today;
    
    let classes = 'relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200';

    if (!isCurrentMonth) {
      classes += ' text-slate-400 dark:text-slate-500';
    } else {
      classes += ' text-slate-700 dark:text-slate-200';
    }

    if (isPast) {
      classes += ' cursor-not-allowed opacity-50';
    } else {
      classes += ' hover:bg-indigo-100 dark:hover:bg-indigo-900/50';
    }

    if (isSelected) {
      classes += ' bg-indigo-600 text-white font-bold shadow-lg';
    } else if (isToday) {
      classes += ' bg-slate-200 dark:bg-slate-700 font-semibold';
    }

    return classes;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-slate-500 dark:text-slate-400 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const isPast = date < today;
          return (
            <div key={index} className="flex justify-center items-center">
              <button
                disabled={isPast}
                onClick={() => onDateSelect(date)}
                className={getDayClasses(date)}
              >
                {date.getDate()}
                {appointmentDates.has(date.toDateString()) && ! (selectedDate?.toDateString() === date.toDateString()) && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Calendar;
   