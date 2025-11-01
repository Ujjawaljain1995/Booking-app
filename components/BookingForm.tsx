import React from 'react';
import { User } from '../types';

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  onBookAppointment: () => void;
  onCancel: () => void;
  currentUser: User;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedDate, selectedTime, onBookAppointment, onCancel, currentUser }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookAppointment();
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg shadow-inner">
        <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Confirm Your Appointment</h3>
            <p className="text-slate-600 dark:text-slate-300">
                On <span className="font-semibold text-indigo-500">{selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span> at <span className="font-semibold text-indigo-500">{selectedTime}</span>
            </p>
        </div>
        <div className="space-y-4 bg-white dark:bg-slate-900/50 p-4 rounded-md border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Name</label>
            <p className="text-slate-800 dark:text-slate-200 font-semibold">{currentUser.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">Email</label>
            <p className="text-slate-800 dark:text-slate-200 font-semibold">{currentUser.email}</p>
          </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-end gap-4 pt-6">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
                Confirm Booking
            </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
