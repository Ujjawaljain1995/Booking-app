import React, { useState } from 'react';
import { Appointment, User } from '../types';
import Calendar from './Calendar';
import TimeSlotPicker from './TimeSlotPicker';
import BookingForm from './BookingForm';

interface CustomerViewProps {
  appointments: Appointment[];
  addAppointment: (newAppointment: Omit<Appointment, 'id'>) => void;
  currentUser: User;
}

const CustomerView: React.FC<CustomerViewProps> = ({ appointments, addAppointment, currentUser }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState<boolean>(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setBookingComplete(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime && currentUser) {
      addAppointment({
        date: selectedDate,
        time: selectedTime,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
      });
      setBookingComplete(true);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const handleCancelBooking = () => {
    setSelectedTime(null);
  }

  const handleNewBooking = () => {
    setBookingComplete(false);
  }

  if (bookingComplete) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Appointment Booked Successfully!</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Thank you, {currentUser.name}. You will receive a confirmation email shortly.</p>
        <button
          onClick={handleNewBooking}
          className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">
          {selectedTime ? 'Step 3: Confirm Your Details' : selectedDate ? 'Step 2: Select a Time' : 'Step 1: Select a Date'}
        </h2>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          appointments={appointments}
        />
      </div>
      <div className="flex flex-col justify-center">
        {selectedDate && !selectedTime && (
          <TimeSlotPicker
            selectedDate={selectedDate}
            onTimeSelect={handleTimeSelect}
            appointments={appointments}
          />
        )}
        {selectedDate && selectedTime && (
          <BookingForm
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onBookAppointment={handleBookAppointment}
            onCancel={handleCancelBooking}
            currentUser={currentUser}
          />
        )}
        {!selectedDate && (
          <div className="text-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg p-10 flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="font-semibold">Please select a date from the calendar to see available time slots.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerView;
