export interface Appointment {
  id: number;
  date: Date;
  time: string;
  customerName: string;
  customerEmail: string;
}

export enum Role {
  CUSTOMER = 'CUSTOMER',
  BUSINESS = 'BUSINESS',
}

export interface User {
  id: number;
  email: string;
  password; // In a real app, this would be hashed
  role: Role;
  name: string;
}
