import { Client, Repair, Vehicle } from "../types";

function newId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const now = () => new Date().toISOString();

let clients: Client[] = [
  {
    id: "c1111111-1111-4111-8111-111111111101",
    first_name: "Jean",
    last_name: "Dupont",
    email: "jean.dupont@email.com",
    phone: "+221 77 123 45 67",
    is_professional: false,
    created_at: now(),
    updated_at: now(),
  },
  {
    id: "c1111111-1111-4111-8111-111111111102",
    first_name: "Fatou",
    last_name: "Sow",
    email: "contact@transportsow.sn",
    phone: "+221 33 987 65 43",
    company_name: "Transport Sow SARL",
    is_professional: true,
    created_at: now(),
    updated_at: now(),
  },
];

let vehicles: Vehicle[] = [
  {
    id: "v1111111-1111-4111-8111-111111111101",
    client_id: "c1111111-1111-4111-8111-111111111101",
    make: "Toyota",
    model: "Corolla",
    year: 2019,
    license_plate: "DK-1234-AB",
    mileage: 45000,
    created_at: now(),
    updated_at: now(),
  },
  {
    id: "v1111111-1111-4111-8111-111111111102",
    client_id: "c1111111-1111-4111-8111-111111111102",
    make: "Mercedes",
    model: "Sprinter",
    year: 2021,
    license_plate: "TH-5678-CD",
    mileage: 82000,
    created_at: now(),
    updated_at: now(),
  },
];

let repairs: Repair[] = [
  {
    id: "r1111111-1111-4111-8111-111111111101",
    vehicle_id: "v1111111-1111-4111-8111-111111111101",
    description: "Vidange moteur et filtres",
    status: "completed",
    total_cost: 45000,
    created_at: now(),
    updated_at: now(),
  },
  {
    id: "r1111111-1111-4111-8111-111111111102",
    vehicle_id: "v1111111-1111-4111-8111-111111111102",
    description: "Freins avant — plaquettes et disques",
    status: "in_progress",
    total_cost: 120000,
    created_at: now(),
    updated_at: now(),
  },
];

export const demoStore = {
  getClients: () => [...clients],
  getClient: (id: string) => clients.find((c) => c.id === id),
  createClient: (data: Partial<Client>): Client => {
    const client: Client = {
      id: newId(),
      first_name: data.first_name?.trim() ?? "",
      last_name: data.last_name?.trim() ?? "",
      email: data.email?.trim() || undefined,
      phone: data.phone?.trim() || undefined,
      address: data.address?.trim() || undefined,
      company_name: data.company_name?.trim() || undefined,
      is_professional: Boolean(data.is_professional),
      notes: data.notes?.trim() || undefined,
      created_at: now(),
      updated_at: now(),
    };
    clients = [client, ...clients];
    return client;
  },
  updateClient: (id: string, data: Partial<Client>): Client => {
    const idx = clients.findIndex((c) => c.id === id);
    if (idx < 0) throw new Error("Client introuvable");
    clients[idx] = { ...clients[idx], ...data, updated_at: now() };
    return clients[idx];
  },
  deleteClient: (id: string) => {
    clients = clients.filter((c) => c.id !== id);
    vehicles = vehicles.filter((v) => v.client_id !== id);
    const vehicleIds = new Set(vehicles.map((v) => v.id));
    repairs = repairs.filter((r) => vehicleIds.has(r.vehicle_id));
  },

  getVehicles: () => [...vehicles],
  getVehicle: (id: string) => vehicles.find((v) => v.id === id),
  createVehicle: (data: Partial<Vehicle>): Vehicle => {
    const vehicle: Vehicle = {
      id: newId(),
      client_id: data.client_id ?? "",
      make: data.make?.trim() ?? "",
      model: data.model?.trim() ?? "",
      year: Number(data.year) || new Date().getFullYear(),
      license_plate: data.license_plate?.trim() ?? "",
      vin: data.vin?.trim() || undefined,
      mileage: Number(data.mileage) || 0,
      created_at: now(),
      updated_at: now(),
    };
    vehicles = [vehicle, ...vehicles];
    return vehicle;
  },
  updateVehicle: (id: string, data: Partial<Vehicle>): Vehicle => {
    const idx = vehicles.findIndex((v) => v.id === id);
    if (idx < 0) throw new Error("Véhicule introuvable");
    vehicles[idx] = { ...vehicles[idx], ...data, updated_at: now() };
    return vehicles[idx];
  },
  deleteVehicle: (id: string) => {
    vehicles = vehicles.filter((v) => v.id !== id);
    repairs = repairs.filter((r) => r.vehicle_id !== id);
  },

  getRepairs: () => [...repairs],
  getRepair: (id: string) => repairs.find((r) => r.id === id),
  createRepair: (data: Partial<Repair>): Repair => {
    const repair: Repair = {
      id: newId(),
      vehicle_id: data.vehicle_id ?? "",
      mechanic_id: data.mechanic_id,
      description: data.description?.trim() ?? "",
      status: data.status ?? "pending",
      start_date: data.start_date,
      end_date: data.end_date,
      total_cost: Number(data.total_cost) || 0,
      created_at: now(),
      updated_at: now(),
    };
    repairs = [repair, ...repairs];
    return repair;
  },
  updateRepair: (id: string, data: Partial<Repair>): Repair => {
    const idx = repairs.findIndex((r) => r.id === id);
    if (idx < 0) throw new Error("Réparation introuvable");
    repairs[idx] = { ...repairs[idx], ...data, updated_at: now() };
    return repairs[idx];
  },
  deleteRepair: (id: string) => {
    repairs = repairs.filter((r) => r.id !== id);
  },
};
