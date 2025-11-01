import React, { useState, useMemo } from 'react';
import { Appointment, User } from '../types';
import Calendar from './Calendar';
import TimeSlotPicker from './TimeSlotPicker';
import BookingForm from './BookingForm';
import { BriefcaseIcon, ChevronLeftIcon } from './Icons';

interface CustomerViewProps {
  appointments: Appointment[];
  addAppointment: (newAppointment: Omit<Appointment, 'id'>) => void;
  currentUser: User;
  businesses: User[];
}

const CustomerView: React.FC<CustomerViewProps> = ({ appointments, addAppointment, currentUser, businesses }) => {
  const [selectedBusiness, setSelectedBusiness] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState<boolean>(false);

  const handleSelectBusiness = (business: User) => {
    setSelectedBusiness(business);
    setSelectedDate(null);
    setSelectedTime(null);
    setBookingComplete(false);
  }

  const handleBackToList = () => {
    setSelectedBusiness(null);
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setBookingComplete(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime && currentUser && selectedBusiness) {
      addAppointment({
        date: selectedDate,
        time: selectedTime,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        businessId: selectedBusiness.id,
      });
      setBookingComplete(true);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  };

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [businesses, searchQuery]);

  // Business List View
  if (!selectedBusiness) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">Find a Business</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Search and book an appointment with our partners.</p>
        <input 
          type="text"
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 mb-6 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map(business => (
            <div key={business.id} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <BriefcaseIcon className="w-6 h-6 text-indigo-500" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{business.name}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">{business.description}</p>
              </div>
              <button
                onClick={() => handleSelectBusiness(business)}
                className="w-full mt-4 bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                View & Book
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Booking View for a selected business
  const appointmentsForBusiness = appointments.filter(a => a.businessId === selectedBusiness.id);

  if (bookingComplete) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">Appointment Booked Successfully!</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Your appointment with <span className="font-semibold">{selectedBusiness.name}</span> is confirmed.</p>
        <button
          onClick={() => { setBookingComplete(false); setSelectedBusiness(null); }}
          className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleBackToList} className="flex items-center gap-2 mb-6 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
        <ChevronLeftIcon className="w-5 h-5" />
        Back to Business List
      </button>

      <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedBusiness.name}</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-1">{selectedBusiness.description}</p>
          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-slate-700 dark:text-slate-200">Services Offered:</h4>
            <ul className="list-none space-y-2">
              {selectedBusiness.services?.map(service => (
                <li key={service.name} className="flex justify-between items-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                    <div>
                        <strong className="text-slate-800 dark:text-slate-100">{service.name}</strong>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{service.description}</p>
                    </div>
                    {service.price && (
                        <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">${service.price.toFixed(2)}</span>
                    )}
                </li>
              ))}
            </ul>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-200">
            {selectedTime ? 'Step 2: Confirm Your Details' : 'Step 1: Select a Date & Time'}
          </h2>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            appointments={appointmentsForBusiness}
          />
        </div>
        <div className="flex flex-col justify-center">
          {selectedDate && !selectedTime && (
            <TimeSlotPicker
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
              appointments={appointmentsForBusiness}
              availability={selectedBusiness.availability || []}
            />
          )}
          {selectedDate && selectedTime && (
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onBookAppointment={handleBookAppointment}
              onCancel={() => setSelectedTime(null)}
              currentUser={currentUser}
            />
          )}
          {!selectedDate && (
            <div className="text-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg p-10 flex flex-col items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="font-semibold">Please select a date to book with {selectedBusiness.name}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerView;