import { NextRequest, NextResponse } from 'next/server'
import { Repair } from '@/types'

// Données mockées pour les réparations
let repairs: Repair[] = [
  {
    id: 'repair_1',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440001',
    mechanic_id: 'mech1',
    description: 'Vidange moteur et filtre',
    status: 'completed',
    start_date: '2024-05-10T08:00:00Z',
    end_date: '2024-05-10T10:00:00Z',
    total_cost: 85.50,
    notes: 'Client satisfait',
    created_at: '2024-05-10T07:30:00Z',
    updated_at: '2024-05-10T10:00:00Z'
  },
  {
    id: 'repair_2',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440002',
    mechanic_id: 'mech2',
    description: 'Remplacement plaquettes de frein',
    status: 'in_progress',
    start_date: '2024-05-12T09:00:00Z',
    total_cost: 150.00,
    notes: 'En attente de pièces',
    created_at: '2024-05-12T08:30:00Z',
    updated_at: '2024-05-12T09:00:00Z'
  },
  {
    id: 'repair_3',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440004',
    mechanic_id: 'mech3',
    description: 'Diagnostic climatisation',
    status: 'pending',
    total_cost: 45.00,
    notes: '',
    created_at: '2024-05-13T10:00:00Z',
    updated_at: '2024-05-13T10:00:00Z'
  },
  {
    id: 'repair_4',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440005',
    mechanic_id: 'mech1',
    description: 'Révision complète',
    status: 'completed',
    start_date: '2024-05-08T08:00:00Z',
    end_date: '2024-05-08T16:00:00Z',
    total_cost: 250.00,
    notes: 'Vérification tous les systèmes',
    created_at: '2024-05-08T07:00:00Z',
    updated_at: '2024-05-08T16:00:00Z'
  },
  {
    id: 'repair_5',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440006',
    mechanic_id: 'mech2',
    description: 'Changement batterie',
    status: 'pending',
    total_cost: 120.00,
    notes: 'Client a appelé pour problème de démarrage',
    created_at: '2024-05-14T11:00:00Z',
    updated_at: '2024-05-14T11:00:00Z'
  },
  {
    id: 'repair_6',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440007',
    mechanic_id: 'mech4',
    description: 'Réparation pneu crevé',
    status: 'cancelled',
    total_cost: 0,
    notes: 'Client a annulé',
    created_at: '2024-05-11T14:00:00Z',
    updated_at: '2024-05-11T15:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicle_id')

    let filteredRepairs = repairs

    // Filtrer par véhicule
    if (vehicleId) {
      filteredRepairs = filteredRepairs.filter(repair => repair.vehicle_id === vehicleId)
    }

    return NextResponse.json(filteredRepairs)
  } catch (error) {
    console.error('Error fetching repairs:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réparations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const repairData = await request.json()

    // Validation basique
    if (!repairData.vehicle_id || !repairData.description) {
      return NextResponse.json(
        { error: 'Le véhicule et la description sont obligatoires' },
        { status: 400 }
      )
    }

    if (repairData.total_cost < 0) {
      return NextResponse.json(
        { error: 'Le coût ne peut pas être négatif' },
        { status: 400 }
      )
    }

    // Créer la nouvelle réparation
    const newRepair: Repair = {
      id: `repair_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      vehicle_id: repairData.vehicle_id,
      mechanic_id: repairData.mechanic_id || null,
      description: repairData.description,
      status: repairData.status || 'pending',
      start_date: repairData.start_date || null,
      end_date: repairData.end_date || null,
      total_cost: repairData.total_cost || 0,
      notes: repairData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    repairs.push(newRepair)

    return NextResponse.json(newRepair, { status: 201 })
  } catch (error) {
    console.error('Error creating repair:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réparation' },
      { status: 500 }
    )
  }
}
