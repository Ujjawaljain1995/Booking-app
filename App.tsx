import React, { useState } from 'react';
import { Appointment, User, Role } from './types';
import Header from './components/Header';
import CustomerView from './components/CustomerView';
import BusinessView from './components/BusinessView';
import AuthPage from './components/AuthPage';

const App: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: '10:00 AM',
      customerName: 'Alice Johnson',
      customerEmail: 'customer@example.com',
    },
    {
      id: 2,
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: '02:00 PM',
      customerName: 'Bob Williams',
      customerEmail: 'bob@example.com',
    },
     {
      id: 3,
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: '11:00 AM',
      customerName: 'Charlie Brown',
      customerEmail: 'charlie@example.com',
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: 1, email: 'customer@example.com', password: 'password', role: Role.CUSTOMER, name: 'Alice Johnson' },
    { id: 2, email: 'business@example.com', password: 'password', role: Role.BUSINESS, name: 'The Scheduling Co.' },
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  const addAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
    setAppointments(prev => [
      ...prev,
      { ...newAppointment, id: Date.now() },
    ]);
  };

  const handleRegister = (newUser: Omit<User, 'id'>) => {
    if (users.find(u => u.email === newUser.email)) {
      alert('An account with this email already exists.');
      return false;
    }
    const userWithId = { ...newUser, id: Date.now() };
    setUsers(prev => [...prev, userWithId]);
    setCurrentUser(userWithId);
    return true;
  };

  const handleLogin = (credentials: Pick<User, 'email' | 'password'>) => {
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) {
      setCurrentUser(user);
      return true;
    } else {
      alert('Invalid email or password.');
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <div className="container mx-auto p-4 md:p-8">
        {!currentUser ? (
          <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
        ) : (
          <>
            <Header currentUser={currentUser} onLogout={handleLogout} />
            <main className="mt-8 bg-white dark:bg-slate-800/50 shadow-2xl rounded-2xl p-6 md:p-8 ring-1 ring-slate-200 dark:ring-slate-700">
              {currentUser.role === Role.CUSTOMER ? (
                <CustomerView
                  appointments={appointments}
                  addAppointment={addAppointment}
                  currentUser={currentUser}
                />
              ) : (
                <BusinessView appointments={appointments} />
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
