import axios, { AxiosInstance } from "axios";
import { API_BASE_URL } from "../config/api";
import {
  DEMO_TOKEN,
  getApiErrorMessage,
  isDemoToken,
  unwrapEntity,
  unwrapList,
} from "../utils/apiHelpers";
import { Client, Invoice, Part, Repair, Vehicle } from "../types";
import { demoStore } from "./demoStore";
import { storageService } from "./storageService";

type UnauthorizedHandler = () => void | Promise<void>;

class ApiService {
  private api: AxiosInstance;
  private onUnauthorized: UnauthorizedHandler | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: { "Content-Type": "application/json" },
    });

    this.api.interceptors.request.use(
      async (config) => {
        const token = await storageService.getToken();
        if (token && !isDemoToken(token)) {
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
          await this.onUnauthorized?.();
        }
        return Promise.reject(error);
      },
    );
  }

  setOnUnauthorized(handler: UnauthorizedHandler | null) {
    this.onUnauthorized = handler;
  }

  private async isDemoMode(): Promise<boolean> {
    const token = await storageService.getToken();
    return isDemoToken(token);
  }

  private handleError(error: unknown): never {
    throw new Error(getApiErrorMessage(error, "Erreur de communication avec le serveur"));
  }

  async getClients(): Promise<Client[]> {
    if (await this.isDemoMode()) return demoStore.getClients();
    try {
      const response = await this.api.get("/clients");
      return unwrapList<Client>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getClient(id: string): Promise<Client> {
    if (await this.isDemoMode()) {
      const c = demoStore.getClient(id);
      if (!c) throw new Error("Client introuvable");
      return c;
    }
    try {
      const response = await this.api.get(`/clients/${id}`);
      return unwrapEntity<Client>(response.data, ["client"]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createClient(clientData: Partial<Client>): Promise<Client> {
    if (await this.isDemoMode()) return demoStore.createClient(clientData);
    try {
      const response = await this.api.post("/clients", clientData);
      return unwrapEntity<Client>(response.data, ["client"]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    if (await this.isDemoMode()) return demoStore.updateClient(id, clientData);
    try {
      const response = await this.api.put(`/clients/${id}`, clientData);
      return unwrapEntity<Client>(response.data, ["client"]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteClient(id: string): Promise<void> {
    if (await this.isDemoMode()) {
      demoStore.deleteClient(id);
      return;
    }
    try {
      await this.api.delete(`/clients/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVehicles(): Promise<Vehicle[]> {
    if (await this.isDemoMode()) return demoStore.getVehicles();
    try {
      const response = await this.api.get("/vehicles");
      return unwrapList<Vehicle>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVehicle(id: string): Promise<Vehicle> {
    if (await this.isDemoMode()) {
      const v = demoStore.getVehicle(id);
      if (!v) throw new Error("Véhicule introuvable");
      return v;
    }
    try {
      const response = await this.api.get(`/vehicles/${id}`);
      return unwrapEntity<Vehicle>(response.data, ["vehicle"]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createVehicle(vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    if (await this.isDemoMode()) return demoStore.createVehicle(vehicleData);
    try {
      const response = await this.api.post("/vehicles", vehicleData);
      return unwrapEntity<Vehicle>(response.data, ["vehicle"]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
    if (await this.isDemoMode()) return demoStore.updateVehicle(id, vehicleData);
    try {
      const response = await this.api.put(`/vehicles/${id}`, vehicleData);
      return unwrapEntity<Vehicle>(response.data, ["vehicle"]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteVehicle(id: string): Promise<void> {
    if (await this.isDemoMode()) {
      demoStore.deleteVehicle(id);
      return;
    }
    try {
      await this.api.delete(`/vehicles/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRepairs(): Promise<Repair[]> {
    if (await this.isDemoMode()) return demoStore.getRepairs();
    try {
      const response = await this.api.get("/repairs");
      return unwrapList<Repair>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRepair(id: string): Promise<Repair> {
    if (await this.isDemoMode()) {
      const r = demoStore.getRepair(id);
      if (!r) throw new Error("Réparation introuvable");
      return r;
    }
    try {
      const response = await this.api.get(`/repairs/${id}`);
      return unwrapEntity<Repair>(response.data, ["repair"]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createRepair(repairData: Partial<Repair>): Promise<Repair> {
    if (await this.isDemoMode()) return demoStore.createRepair(repairData);
    try {
      const response = await this.api.post("/repairs", repairData);
      return unwrapEntity<Repair>(response.data, ["repair"]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateRepair(id: string, repairData: Partial<Repair>): Promise<Repair> {
    if (await this.isDemoMode()) return demoStore.updateRepair(id, repairData);
    try {
      const response = await this.api.put(`/repairs/${id}`, repairData);
      return unwrapEntity<Repair>(response.data, ["repair"]);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteRepair(id: string): Promise<void> {
    if (await this.isDemoMode()) {
      demoStore.deleteRepair(id);
      return;
    }
    try {
      await this.api.delete(`/repairs/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getInvoices(): Promise<Invoice[]> {
    if (await this.isDemoMode()) return [];
    try {
      const response = await this.api.get("/invoices");
      return unwrapList<Invoice>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteInvoice(id: string): Promise<void> {
    if (await this.isDemoMode()) return;
    try {
      await this.api.delete(`/invoices/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getParts(): Promise<Part[]> {
    if (await this.isDemoMode()) return [];
    try {
      const response = await this.api.get("/parts");
      return unwrapList<Part>(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deletePart(id: string): Promise<void> {
    if (await this.isDemoMode()) return;
    try {
      await this.api.delete(`/parts/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const apiService = new ApiService();
