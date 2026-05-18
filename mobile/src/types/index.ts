export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
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
  total_amount: number;
  status: "pending" | "paid" | "overdue" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
