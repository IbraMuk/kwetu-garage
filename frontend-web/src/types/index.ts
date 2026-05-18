export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  role: "admin" | "manager" | "mechanic" | "receptionist";
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  company_name?: string;
  is_professional: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  client_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin?: string;
  mileage: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Repair {
  id: string;
  vehicle_id: string;
  mechanic_id?: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  start_date?: string;
  end_date?: string;
  total_cost: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Part {
  id: string;
  name: string;
  reference?: string;
  description?: string;
  price: number;
  stock_quantity: number;
  min_stock_level: number;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  repair_id?: string;
  invoice_number: string;
  issue_date: string;
  due_date?: string;
  subtotal?: number;
  tax_rate?: number;
  total_amount: number;
  status: "pending" | "paid" | "overdue" | "cancelled";
  payment_method?: string;
  payment_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  client_id: string;
  vehicle_id: string;
  mechanic_id: string | null;
  title: string;
  description?: string;
  appointment_date: string;
  duration_minutes: number;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}
