import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "../config/api";
import { getApiErrorMessage, unwrapList } from "../utils/apiHelpers";
import { Client, Invoice, Part, Repair, Vehicle } from "../types";
import { storageService } from "./storageService";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      async (config) => {
        const token = await storageService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await storageService.clearAuth();
        }
        return Promise.reject(error);
      },
    );
  }

  private handleError(error: unknown): never {
    throw new Error(getApiErrorMessage(error, "Erreur de communication avec le serveur"));
  }

  async getClients(): Promise<Client[]> {
    try {
      const response = await this.api.get("/clients");
      return unwrapList<Client>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getClient(id: string): Promise<Client> {
    try {
      const response = await this.api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createClient(clientData: Partial<Client>): Promise<Client> {
    try {
      const response = await this.api.post("/clients", clientData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    try {
      const response = await this.api.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteClient(id: string): Promise<void> {
    try {
      await this.api.delete(`/clients/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await this.api.get("/vehicles");
      return unwrapList<Vehicle>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVehicle(id: string): Promise<Vehicle> {
    try {
      const response = await this.api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const response = await this.api.post("/vehicles", vehicleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    try {
      const response = await this.api.put(`/vehicles/${id}`, vehicleData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteVehicle(id: string): Promise<void> {
    try {
      await this.api.delete(`/vehicles/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRepairs(): Promise<Repair[]> {
    try {
      const response = await this.api.get("/repairs");
      return unwrapList<Repair>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRepair(id: string): Promise<Repair> {
    try {
      const response = await this.api.get(`/repairs/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createRepair(repairData: Partial<Repair>): Promise<Repair> {
    try {
      const response = await this.api.post("/repairs", repairData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateRepair(id: string, repairData: Partial<Repair>): Promise<Repair> {
    try {
      const response = await this.api.put(`/repairs/${id}`, repairData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteRepair(id: string): Promise<void> {
    try {
      await this.api.delete(`/repairs/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getInvoices(): Promise<Invoice[]> {
    try {
      const response = await this.api.get("/invoices");
      return unwrapList<Invoice>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getParts(): Promise<Part[]> {
    try {
      const response = await this.api.get("/parts");
      return unwrapList<Part>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const apiService = new ApiService();
