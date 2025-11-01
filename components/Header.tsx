import React from 'react';
import { User } from '../types';
import { LogoutIcon } from './Icons';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          Appointment Scheduler
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentUser.name}</span>!
        </p>
      </div>
      <div className="flex items-center">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-500 ring-1 ring-slate-200 dark:ring-slate-600"
        >
          <LogoutIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
