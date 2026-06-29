import { NextRequest, NextResponse } from 'next/server'
import { Appointment } from '@/types'

// Données mockées (même tableau que dans route.ts)
let appointments: Appointment[] = [
  {
    id: 'C30e8400-e29b-41d4-a716-446655440001',
    client_id: '770e8400-e29b-41d4-a716-446655440001',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440001',
    mechanic_id: 'mech1',
    title: 'Vidange régulière',
    description: 'Vidange moteur et filtre',
    appointment_date: '2024-05-20T09:00:00Z',
    duration_minutes: 30,
    status: 'scheduled',
    notes: 'Client fidèle',
    created_at: '2024-05-12T08:00:00Z',
    updated_at: '2024-05-12T08:00:00Z'
  },
  {
    id: 'C30e8400-e29b-41d4-a716-446655440002',
    client_id: '770e8400-e29b-41d4-a716-446655440002',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440002',
    mechanic_id: 'mech2',
    title: 'Contrôle climatisation',
    description: 'Climatisation faible',
    appointment_date: '2024-05-21T14:00:00Z',
    duration_minutes: 60,
    status: 'scheduled',
    created_at: '2024-05-12T09:00:00Z',
    updated_at: '2024-05-12T09:00:00Z'
  },
  {
    id: 'C30e8400-e29b-41d4-a716-446655440003',
    client_id: '770e8400-e29b-41d4-a716-446655440004',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440004',
    mechanic_id: null,
    title: 'Entretien flotte',
    description: 'Entretien véhicules entreprise',
    appointment_date: '2024-05-22T08:00:00Z',
    duration_minutes: 240,
    status: 'scheduled',
    notes: '3 véhicules',
    created_at: '2024-05-12T10:00:00Z',
    updated_at: '2024-05-12T10:00:00Z'
  },
  {
    id: 'C30e8400-e29b-41d4-a716-446655440004',
    client_id: '770e8400-e29b-41d4-a716-446655440005',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440005',
    mechanic_id: 'mech1',
    title: 'Changement pneus',
    description: 'Montage pneus neufs',
    appointment_date: '2024-05-23T10:00:00Z',
    duration_minutes: 60,
    status: 'confirmed',
    notes: 'Pneus en stock',
    created_at: '2024-05-12T11:00:00Z',
    updated_at: '2024-05-12T11:00:00Z'
  },
  {
    id: 'C30e8400-e29b-41d4-a716-446655440005',
    client_id: '770e8400-e29b-41d4-a716-446655440001',
    vehicle_id: '880e8400-e29b-41d4-a716-446655440001',
    mechanic_id: 'mech2',
    title: 'Révision complète',
    description: 'Révision annuelle complète',
    appointment_date: '2024-05-10T08:00:00Z',
    duration_minutes: 120,
    status: 'completed',
    created_at: '2024-05-10T07:00:00Z',
    updated_at: '2024-05-10T10:00:00Z'
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointment = appointments.find(a => a.id === id)

    if (!appointment) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du rendez-vous' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointmentData = await request.json()
    const appointmentIndex = appointments.findIndex(a => a.id === id)

    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      )
    }

    // Validation basique
    if (!appointmentData.title) {
      return NextResponse.json(
        { error: 'Le titre est obligatoire' },
        { status: 400 }
      )
    }

    if (appointmentData.duration_minutes && appointmentData.duration_minutes < 15) {
      return NextResponse.json(
        { error: 'La durée minimale est de 15 minutes' },
        { status: 400 }
      )
    }

    // Mettre à jour le rendez-vous
    const updatedAppointment: Appointment = {
      ...appointments[appointmentIndex],
      ...appointmentData,
      updated_at: new Date().toISOString()
    }

    appointments[appointmentIndex] = updatedAppointment

    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du rendez-vous' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const appointmentIndex = appointments.findIndex(a => a.id === id)

    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      )
    }

    const deletedAppointment = appointments[appointmentIndex]
    appointments.splice(appointmentIndex, 1)

    return NextResponse.json({ 
      message: 'Rendez-vous supprimé avec succès',
      appointment: deletedAppointment 
    })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du rendez-vous' },
      { status: 500 }
    )
  }
}
