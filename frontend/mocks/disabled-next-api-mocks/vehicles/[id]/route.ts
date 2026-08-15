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
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const vehicle = vehicles.find((v) => v.id === id);

    if (!vehicle) {
      return NextResponse.json(
        { error: "Véhicule non trouvé" },
        { status: 404 },
      );
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du véhicule" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const vehicleData = await request.json();
    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      return NextResponse.json(
        { error: "Véhicule non trouvé" },
        { status: 404 },
      );
    }

    // Validation basique
    if (!vehicleData.make || !vehicleData.model || !vehicleData.license_plate) {
      return NextResponse.json(
        { error: "La marque, le modèle et la plaque sont obligatoires" },
        { status: 400 },
      );
    }

    if (
      vehicleData.year &&
      (vehicleData.year < 1900 ||
        vehicleData.year > new Date().getFullYear() + 1)
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

    // Mettre à jour le véhicule
    const updatedVehicle: Vehicle = {
      ...vehicles[vehicleIndex],
      ...vehicleData,
      updated_at: new Date().toISOString(),
    };

    vehicles[vehicleIndex] = updatedVehicle;

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du véhicule" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      return NextResponse.json(
        { error: "Véhicule non trouvé" },
        { status: 404 },
      );
    }

    const deletedVehicle = vehicles[vehicleIndex];
    vehicles.splice(vehicleIndex, 1);

    return NextResponse.json({
      message: "Véhicule supprimé avec succès",
      vehicle: deletedVehicle,
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du véhicule" },
      { status: 500 },
    );
  }
}
