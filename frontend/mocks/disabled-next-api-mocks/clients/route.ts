import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@/types'

// Données mockées (remplacer par vraie base de données)
let clients: Client[] = [
  {
    id: '770e8400-e29b-41d4-a716-446655440001',
    first_name: 'Mamadou',
    last_name: 'Diallo',
    email: 'mamadou.diallo@email.com',
    phone: '+221 77 123 45 67',
    address: 'Rue 123, Dakar',
    is_professional: false,
    notes: 'Client fidèle, vient régulièrement pour l\'entretien',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-05-10T14:20:00Z'
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440002',
    first_name: 'Fatou',
    last_name: 'Sarr',
    email: 'fatou.sarr@email.com',
    phone: '+221 76 234 56 78',
    address: 'Avenue 456, Thiès',
    is_professional: false,
    created_at: '2024-02-20T09:15:00Z',
    updated_at: '2024-05-08T11:30:00Z'
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440003',
    first_name: 'Cheikh',
    last_name: 'Lo',
    email: 'cheikh.lo@email.com',
    phone: '+221 78 345 67 89',
    address: 'Boulevard 789, Saint-Louis',
    is_professional: false,
    created_at: '2024-03-10T16:45:00Z',
    updated_at: '2024-05-12T10:15:00Z'
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440004',
    first_name: 'Aminata',
    last_name: 'Cissé',
    email: 'contact@transport-senegal.sn',
    phone: '+221 33 456 78 90',
    address: 'Zone Industrielle, Diamniadio',
    company_name: 'Transport Sénégal SARL',
    is_professional: true,
    notes: 'Entreprise de transport, flotte de 15 véhicules',
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-05-11T15:45:00Z'
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440005',
    first_name: 'Baba',
    last_name: 'Diop',
    email: 'baba.diop@email.com',
    phone: '+221 77 567 89 01',
    address: 'Impasse 321, Kaolack',
    is_professional: false,
    created_at: '2024-04-18T13:20:00Z',
    updated_at: '2024-05-09T09:30:00Z'
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440006',
    first_name: 'Mariam',
    last_name: 'Sow',
    email: 'mariam.sow@email.com',
    phone: '+221 76 678 90 12',
    address: 'Route 654, Mbour',
    is_professional: false,
    notes: 'Préfère les rendez-vous le samedi',
    created_at: '2024-05-01T11:00:00Z',
    updated_at: '2024-05-01T11:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isProfessional = searchParams.get('is_professional')
    const search = searchParams.get('search')

    let filteredClients = clients

    // Filtrer par type professionnel
    if (isProfessional === 'true') {
      filteredClients = filteredClients.filter(client => client.is_professional)
    } else if (isProfessional === 'false') {
      filteredClients = filteredClients.filter(client => !client.is_professional)
    }

    // Filtrer par recherche
    if (search) {
      const searchLower = search.toLowerCase()
      filteredClients = filteredClients.filter(client =>
        client.first_name.toLowerCase().includes(searchLower) ||
        client.last_name.toLowerCase().includes(searchLower) ||
        client.email?.toLowerCase().includes(searchLower) ||
        client.phone?.includes(search) ||
        client.company_name?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(filteredClients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientData = await request.json()

    // Validation basique
    if (!clientData.first_name || !clientData.last_name) {
      return NextResponse.json(
        { error: 'Le nom et le prénom sont obligatoires' },
        { status: 400 }
      )
    }

    // Créer le nouveau client
    const newClient: Client = {
      id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      first_name: clientData.first_name,
      last_name: clientData.last_name,
      email: clientData.email || null,
      phone: clientData.phone || null,
      address: clientData.address || null,
      company_name: clientData.company_name || null,
      is_professional: clientData.is_professional || false,
      notes: clientData.notes || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    clients.push(newClient)

    return NextResponse.json(newClient, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    )
  }
}
