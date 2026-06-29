import { NextRequest, NextResponse } from 'next/server'
import { Part } from '@/types'

// Données mockées pour les pièces (même tableau que dans route.ts)
let parts: Part[] = [
  {
    id: 'part_1',
    name: 'Filtre à huile',
    reference: 'FOH-001',
    description: 'Filtre à huile universel pour voitures essence et diesel',
    price: 15.50,
    stock_quantity: 25,
    min_stock_level: 10,
    created_at: '2024-05-01T09:00:00Z',
    updated_at: '2024-05-01T09:00:00Z'
  },
  {
    id: 'part_2',
    name: 'Plaquettes de frein avant',
    reference: 'PFF-002',
    description: 'Plaquettes de frein avant compatibles avec Toyota et Honda',
    price: 45.00,
    stock_quantity: 8,
    min_stock_level: 15,
    created_at: '2024-05-02T10:30:00Z',
    updated_at: '2024-05-02T10:30:00Z'
  },
  {
    id: 'part_3',
    name: 'Bougie d\'allumage',
    reference: 'BOU-003',
    description: 'Bougie d\'allumage iridium',
    price: 8.00,
    stock_quantity: 50,
    min_stock_level: 20,
    created_at: '2024-05-03T11:00:00Z',
    updated_at: '2024-05-03T11:00:00Z'
  },
  {
    id: 'part_4',
    name: 'Courroie de distribution',
    reference: 'COD-004',
    description: 'Courroie de distribution haute qualité',
    price: 35.00,
    stock_quantity: 12,
    min_stock_level: 8,
    created_at: '2024-05-04T14:00:00Z',
    updated_at: '2024-05-04T14:00:00Z'
  },
  {
    id: 'part_5',
    name: 'Ampoule phare H7',
    reference: 'APH-005',
    description: 'Ampoule phare H7 LED',
    price: 12.00,
    stock_quantity: 30,
    min_stock_level: 25,
    created_at: '2024-05-05T15:30:00Z',
    updated_at: '2024-05-05T15:30:00Z'
  },
  {
    id: 'part_6',
    name: 'Batterie 12V',
    reference: 'BAT-006',
    description: 'Batterie automobile 12V 60Ah',
    price: 85.00,
    stock_quantity: 5,
    min_stock_level: 10,
    created_at: '2024-05-06T16:00:00Z',
    updated_at: '2024-05-06T16:00:00Z'
  },
  {
    id: 'part_7',
    name: 'Kit de réparation pneu',
    reference: 'KRP-007',
    description: 'Kit de réparation de pneu avec mousse et compresseur',
    price: 25.00,
    stock_quantity: 15,
    min_stock_level: 10,
    created_at: '2024-05-07T09:00:00Z',
    updated_at: '2024-05-07T09:00:00Z'
  },
  {
    id: 'part_8',
    name: 'Huile moteur 5W30',
    reference: 'HUM-008',
    description: 'Huile moteur synthétique 5W30 5L',
    price: 42.00,
    stock_quantity: 20,
    min_stock_level: 15,
    created_at: '2024-05-08T10:00:00Z',
    updated_at: '2024-05-08T10:00:00Z'
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const part = parts.find(p => p.id === id)

    if (!part) {
      return NextResponse.json(
        { error: 'Pièce non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(part)
  } catch (error) {
    console.error('Error fetching part:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la pièce' },
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
    const partData = await request.json()
    const partIndex = parts.findIndex(p => p.id === id)

    if (partIndex === -1) {
      return NextResponse.json(
        { error: 'Pièce non trouvée' },
        { status: 404 }
      )
    }

    // Validation basique
    if (!partData.name) {
      return NextResponse.json(
        { error: 'Le nom de la pièce est obligatoire' },
        { status: 400 }
      )
    }

    if (partData.price < 0) {
      return NextResponse.json(
        { error: 'Le prix ne peut pas être négatif' },
        { status: 400 }
      )
    }

    if (partData.stock_quantity < 0) {
      return NextResponse.json(
        { error: 'La quantité ne peut pas être négative' },
        { status: 400 }
      )
    }

    if (partData.min_stock_level < 0) {
      return NextResponse.json(
        { error: 'Le stock minimum ne peut pas être négatif' },
        { status: 400 }
      )
    }

    // Mettre à jour la pièce
    const updatedPart: Part = {
      ...parts[partIndex],
      ...partData,
      updated_at: new Date().toISOString()
    }

    parts[partIndex] = updatedPart

    return NextResponse.json(updatedPart)
  } catch (error) {
    console.error('Error updating part:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la pièce' },
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
    const partIndex = parts.findIndex(p => p.id === id)

    if (partIndex === -1) {
      return NextResponse.json(
        { error: 'Pièce non trouvée' },
        { status: 404 }
      )
    }

    const deletedPart = parts[partIndex]
    parts.splice(partIndex, 1)

    return NextResponse.json({ 
      message: 'Pièce supprimée avec succès',
      part: deletedPart 
    })
  } catch (error) {
    console.error('Error deleting part:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la pièce' },
      { status: 500 }
    )
  }
}
