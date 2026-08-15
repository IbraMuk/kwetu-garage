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

export interface RepairSubcategory {
  id: string;
  category_id: string;
  name: string;
}

export interface RepairCategory {
  id: string;
  name: string;
  icon?: string;
  display_order: number;
  subcategories: RepairSubcategory[];
}

export interface Repair {
  id: string;
  client_id?: string;
  vehicle_id: string;
  mechanic_id?: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  start_date?: string;
  end_date?: string;
  total_cost: number;
  notes?: string;
  category_id?: string;
  subcategory_id?: string;
  client_first_name?: string;
  client_last_name?: string;
  mechanic_first_name?: string;
  mechanic_last_name?: string;
  make?: string;
  model?: string;
  license_plate?: string;
  category_name?: string;
  subcategory_name?: string;
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

export interface OrderItem {
  id?: string;
  part_id: string;
  part_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  user_id: string;
  client_name: string;
  phone: string;
  address: string;
  total_amount: number;
  notes?: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface AssistanceRequest {
  id: string;
  user_id: string;
  client_name: string;
  phone: string;
  location: string;
  issue_type: "breakdown" | "towing";
  description?: string;
  status: "pending" | "in_progress" | "resolved" | "cancelled";
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

export interface Mechanic {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  speciality?: string;
  hourly_rate?: number;
  is_available: boolean;
  is_active: boolean;
  hire_date?: string;
  role: string;
  repairs_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}
