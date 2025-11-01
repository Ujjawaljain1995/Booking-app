import React, { useState } from 'react';
import { Appointment, User, Role, Service, Availability } from './types';
import Header from './components/Header';
import CustomerView from './components/CustomerView';
import BusinessView from './components/BusinessView';
import AuthPage from './components/AuthPage';

const initialAvailability: Availability[] = [
    { day: 'Sunday', startTime: '09:00', endTime: '17:00', enabled: false },
    { day: 'Monday', startTime: '09:00', endTime: '17:00', enabled: true },
    { day: 'Tuesday', startTime: '09:00', endTime: '17:00', enabled: true },
    { day: 'Wednesday', startTime: '09:00', endTime: '17:00', enabled: true },
    { day: 'Thursday', startTime: '09:00', endTime: '17:00', enabled: true },
    { day: 'Friday', startTime: '09:00', endTime: '17:00', enabled: true },
    { day: 'Saturday', startTime: '10:00', endTime: '14:00', enabled: false },
];

const App: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: '10:00 AM',
      customerName: 'Alice Johnson',
      customerEmail: 'customer@example.com',
      businessId: 2,
    },
    {
      id: 2,
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: '02:00 PM',
      customerName: 'Bob Williams',
      customerEmail: 'bob@example.com',
      businessId: 2,
    },
     {
      id: 3,
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      time: '11:00 AM',
      customerName: 'Charlie Brown',
      customerEmail: 'charlie@example.com',
      businessId: 3,
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: 1, email: 'customer@example.com', password: 'password', role: Role.CUSTOMER, name: 'Alice Johnson' },
    { 
      id: 2, 
      email: 'business@example.com', 
      password: 'password', 
      role: Role.BUSINESS, 
      name: 'The Scheduling Co.',
      description: 'Your one-stop shop for all scheduling needs. We offer premium consulting services.',
      services: [
        { name: '1-on-1 Consultation', description: 'A 60-minute session with our top experts.', price: 150 },
        { name: 'Team Workshop', description: 'A half-day workshop for your entire team.', price: 500 }
      ],
      availability: initialAvailability,
    },
    { 
      id: 3, 
      email: 'hair@example.com', 
      password: 'password', 
      role: Role.BUSINESS, 
      name: 'Cut & Style Salon',
      description: 'Modern and classic hair styling for everyone.',
      services: [
        { name: 'Haircut', description: 'Includes wash, cut, and style.', price: 45 },
        { name: 'Coloring', description: 'Full-head coloring service.', price: 90 }
      ],
      availability: initialAvailability.map(a => a.day === 'Sunday' || a.day === 'Monday' ? {...a, enabled: false} : {...a, enabled: true}),
    },
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  const addAppointment = (newAppointment: Omit<Appointment, 'id'>) => {
    setAppointments(prev => [
      ...prev,
      { ...newAppointment, id: Date.now() },
    ]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  }

  const handleRegister = (newUser: Omit<User, 'id'>) => {
    if (users.find(u => u.email === newUser.email)) {
      alert('An account with this email already exists.');
      return false;
    }
    const userWithDefaults = {
      ...newUser,
      id: Date.now(),
      ...(newUser.role === Role.BUSINESS && {
        description: 'Welcome to my business page!',
        services: [],
        availability: initialAvailability,
      })
    }
    setUsers(prev => [...prev, userWithDefaults]);
    setCurrentUser(userWithDefaults);
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
                  businesses={users.filter(u => u.role === Role.BUSINESS)}
                />
              ) : (
                <BusinessView 
                  appointments={appointments.filter(a => a.businessId === currentUser.id)}
                  business={currentUser}
                  onUpdateBusiness={updateUser}
                />
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
};

export default App;