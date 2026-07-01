import axios from "axios";
import { API_BASE_URL } from "../config/api";
import { getApiErrorMessage } from "../utils/apiHelpers";

export interface OrderItem {
  part_id: string;
  part_name: string;
  quantity: number;
  unit_price: number;
}

export interface OrderFormData {
  client_name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total_amount: number;
  notes?: string;
}

export interface Order {
  id: string;
  client_name: string;
  phone: string;
  address: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  notes: string;
  created_at: string;
  items: OrderItem[];
}

export const orderService = {
  async create(order: OrderFormData): Promise<Order> {
    try {
      const response = await axios.post(`${API_BASE_URL}/orders`, order);
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erreur lors de la création de la commande"));
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      return response.data.data || [];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Erreur lors de la récupération des commandes"));
    }
  },
};
