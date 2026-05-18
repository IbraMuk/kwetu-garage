import { NextRequest, NextResponse } from 'next/server'
import { Appointment } from '@/types'

// Données mockées pour les rendez-vous
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('client_id')
    const vehicleId = searchParams.get('vehicle_id')

    let filteredAppointments = appointments

    // Filtrer par statut
    if (status) {
      filteredAppointments = filteredAppointments.filter(appointment => appointment.status === status)
    }

    // Filtrer par client
    if (clientId) {
      filteredAppointments = filteredAppointments.filter(appointment => appointment.client_id === clientId)
    }

    // Filtrer par véhicule
    if (vehicleId) {
      filteredAppointments = filteredAppointments.filter(appointment => appointment.vehicle_id === vehicleId)
    }

    // Trier par date
    filteredAppointments.sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())

    return NextResponse.json(filteredAppointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des rendez-vous' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const appointmentData = await request.json()

    // Validation basique
    if (!appointmentData.client_id || !appointmentData.vehicle_id || !appointmentData.title) {
      return NextResponse.json(
        { error: 'Le client, le véhicule et le titre sont obligatoires' },
        { status: 400 }
      )
    }

    if (!appointmentData.appointment_date) {
      return NextResponse.json(
        { error: 'La date du rendez-vous est obligatoire' },
        { status: 400 }
      )
    }

    if (!appointmentData.duration_minutes || appointmentData.duration_minutes < 15) {
      return NextResponse.json(
        { error: 'La durée minimale est de 15 minutes' },
        { status: 400 }
      )
    }

    // Créer le nouveau rendez-vous
    const newAppointment: Appointment = {
      id: `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      client_id: appointmentData.client_id,
      vehicle_id: appointmentData.vehicle_id,
      mechanic_id: appointmentData.mechanic_id || null,
      title: appointmentData.title,
      description: appointmentData.description || null,
      appointment_date: appointmentData.appointment_date,
      duration_minutes: appointmentData.duration_minutes,
      status: appointmentData.status || 'scheduled',
      notes: appointmentData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    appointments.push(newAppointment)

    return NextResponse.json(newAppointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du rendez-vous' },
      { status: 500 }
    )
  }
}
