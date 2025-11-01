import React, { useState } from 'react';
import { Role, User } from '../types';
import { BuildingOfficeIcon, LockClosedIcon, MailIcon, UserCircleIcon, UserIcon } from './Icons';

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  onLogin: (credentials: Pick<User, 'email' | 'password'>) => boolean;
  onRegister: (newUser: Omit<User, 'id'>) => boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<Role>(Role.CUSTOMER);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin({ email, password });
    } else {
      onRegister({ name, email, password, role });
    }
  };

  const isRegister = mode === 'register';

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Welcome to Scheduler
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Your seamless appointment booking solution.</p>
        </div>
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800/50 shadow-2xl rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="p-4 sm:p-6">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
            <button onClick={() => setMode('login')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${mode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}>
              Login
            </button>
            <button onClick={() => setMode('register')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${mode === 'register' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}>
              Sign Up
            </button>
          </div>

          {isRegister && (
             <div className="grid grid-cols-2 gap-2 mb-6">
                <button onClick={() => setRole(Role.CUSTOMER)} className={`flex items-center justify-center gap-2 p-3 rounded-lg font-semibold transition-colors border-2 ${role === Role.CUSTOMER ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 text-indigo-600 dark:text-indigo-300' : 'border-transparent text-slate-500 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    <UserCircleIcon className="w-5 h-5" />
                    Customer
                </button>
                 <button onClick={() => setRole(Role.BUSINESS)} className={`flex items-center justify-center gap-2 p-3 rounded-lg font-semibold transition-colors border-2 ${role === Role.BUSINESS ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 text-indigo-600 dark:text-indigo-300' : 'border-transparent text-slate-500 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                    <BuildingOfficeIcon className="w-5 h-5" />
                    Business
                </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder={role === Role.CUSTOMER ? "Full Name" : "Business Name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MailIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              disabled={!email || !password || (isRegister && !name)}
            >
              {isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
