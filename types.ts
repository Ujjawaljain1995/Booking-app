export interface Appointment {
  id: number;
  date: Date;
  time: string;
  customerName: string;
  customerEmail: string;
  businessId: number;
}

export enum Role {
  CUSTOMER = 'CUSTOMER',
  BUSINESS = 'BUSINESS',
}

export interface Service {
  name: string;
  description: string;
  price?: number;
}

export interface Availability {
  day: string; // e.g., 'Monday'
  startTime: string; // e.g., '09:00'
  endTime: string; // e.g., '17:00'
  enabled: boolean;
}


export interface User {
  id: number;
  email: string;
  password; // In a real app, this would be hashed
  role: Role;
  name: string;
  // Business-specific properties
  description?: string;
  services?: Service[];
  availability?: Availability[];
}