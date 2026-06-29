import { Vehicle } from "@/types";
import { NextRequest, NextResponse } from "next/server";

// Données mockées pour les véhicules
let vehicles: Vehicle[] = [
  {
    id: "880e8400-e29b-41d4-a716-446655440001",
    client_id: "770e8400-e29b-41d4-a716-446655440001",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    license_plate: "DK-1234-AB",
    vin: "1HGBH41JXMN109186",
    mileage: 45000,
    fuel_type: "essence",
    transmission: "manuelle",
    color: "Noir",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-05-10T14:20:00Z",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440002",
    client_id: "770e8400-e29b-41d4-a716-446655440002",
    make: "Peugeot",
    model: "208",
    year: 2022,
    license_plate: "DK-5678-CD",
    vin: "VF7CURHZC12345678",
    mileage: 25000,
    fuel_type: "diesel",
    transmission: "manuelle",
    color: "Blanc",
    created_at: "2024-02-20T09:15:00Z",
    updated_at: "2024-05-08T11:30:00Z",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440004",
    client_id: "770e8400-e29b-41d4-a716-446655440004",
    make: "Mercedes",
    model: "Sprinter",
    year: 2019,
    license_plate: "DK-3456-GH",
    vin: "WDB9061551P123456",
    mileage: 120000,
    fuel_type: "diesel",
    transmission: "automatique",
    color: "Blanc",
    created_at: "2024-01-05T08:00:00Z",
    updated_at: "2024-05-11T15:45:00Z",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440005",
    client_id: "770e8400-e29b-41d4-a716-446655440005",
    make: "Hyundai",
    model: "Tucson",
    year: 2023,
    license_plate: "DK-7890-IJ",
    vin: "KM8J3CA4APU123456",
    mileage: 15000,
    fuel_type: "hybride",
    transmission: "automatique",
    color: "Bleu",
    created_at: "2024-05-08T11:00:00Z",
    updated_at: "2024-05-08T11:00:00Z",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440006",
    client_id: "770e8400-e29b-41d4-a716-446655440006",
    make: "Nissan",
    model: "Almera",
    year: 2020,
    license_plate: "DK-2345-KL",
    vin: "JN1BA17E3AM123456",
    mileage: 40000,
    fuel_type: "essence",
    transmission: "automatique",
    color: "Rouge",
    created_at: "2024-05-09T09:30:00Z",
    updated_at: "2024-05-09T09:30:00Z",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440007",
    client_id: "770e8400-e29b-41d4-a716-446655440001",
    make: "Toyota",
    model: "Hilux",
    year: 2021,
    license_plate: "DK-6789-MN",
    vin: "MR0BE9CDAP123456",
    mileage: 60000,
    fuel_type: "diesel",
    transmission: "manuelle",
    color: "Noir",
    created_at: "2024-05-10T10:15:00Z",
    updated_at: "2024-05-10T10:15:00Z",
  },
  {
    id: "880e8400-e29b-41d4-a716-446655440008",
    client_id: "770e8400-e29b-41d4-a716-446655440002",
    make: "Volkswagen",
    model: "Golf",
    year: 2022,
    license_plate: "DK-0123-OP",
    vin: "WVWZZZAUZNP123456",
    mileage: 20000,
    fuel_type: "diesel",
    transmission: "automatique",
    color: "Gris",
    created_at: "2024-05-11T14:20:00Z",
    updated_at: "2024-05-11T14:20:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("client_id");

    let filteredVehicles = vehicles;

    // Filtrer par client
    if (clientId) {
      filteredVehicles = filteredVehicles.filter(
        (vehicle) => vehicle.client_id === clientId,
      );
    }

    return NextResponse.json(filteredVehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des véhicules" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const vehicleData = await request.json();

    // Validation basique
    if (
      !vehicleData.client_id ||
      !vehicleData.make ||
      !vehicleData.model ||
      !vehicleData.license_plate
    ) {
      return NextResponse.json(
        {
          error:
            "Le client, la marque, le modèle et la plaque sont obligatoires",
        },
        { status: 400 },
      );
    }

    if (
      !vehicleData.year ||
      vehicleData.year < 1900 ||
      vehicleData.year > new Date().getFullYear() + 1
    ) {
      return NextResponse.json(
        { error: "L'année doit être entre 1900 et l'année prochaine" },
        { status: 400 },
      );
    }

    if (vehicleData.vin && vehicleData.vin.length !== 17) {
      return NextResponse.json(
        { error: "Le VIN doit contenir 17 caractères" },
        { status: 400 },
      );
    }

    if (vehicleData.mileage < 0) {
      return NextResponse.json(
        { error: "Le kilométrage ne peut pas être négatif" },
        { status: 400 },
      );
    }

    // Créer le nouveau véhicule
    const newVehicle: Vehicle = {
      id: `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      client_id: vehicleData.client_id,
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      license_plate: vehicleData.license_plate,
      vin: vehicleData.vin || null,
      mileage: vehicleData.mileage || 0,
      fuel_type: vehicleData.fuel_type || "essence",
      transmission: vehicleData.transmission || "manuelle",
      color: vehicleData.color || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    vehicles.push(newVehicle);

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du véhicule" },
      { status: 500 },
    );
  }
}
