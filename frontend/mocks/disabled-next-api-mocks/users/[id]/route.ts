import { NextRequest, NextResponse } from 'next/server'
import { User } from '@/types'

// Données mockées pour les utilisateurs (même tableau que dans route.ts)
let users: User[] = [
  {
    id: 'user_1',
    username: 'admin',
    email: 'admin@kwetugarage.com',
    first_name: 'Jean',
    last_name: 'Dupont',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la République, 75001 Paris',
    role: 'admin',
    is_active: true,
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-01T09:00:00Z'
  },
  {
    id: 'user_2',
    username: 'manager1',
    email: 'manager@kwetugarage.com',
    first_name: 'Marie',
    last_name: 'Martin',
    phone: '+33 6 23 45 67 89',
    address: '456 Avenue des Champs-Élysées, 75008 Paris',
    role: 'manager',
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'user_3',
    username: 'mech1',
    email: 'pierre.bernard@kwetugarage.com',
    first_name: 'Pierre',
    last_name: 'Bernard',
    phone: '+33 6 34 56 78 90',
    address: '789 Rue de la Paix, 75002 Paris',
    role: 'mechanic',
    is_active: true,
    created_at: '2024-02-01T11:00:00Z',
    updated_at: '2024-02-01T11:00:00Z'
  },
  {
    id: 'user_4',
    username: 'mech2',
    email: 'sophie.petit@kwetugarage.com',
    first_name: 'Sophie',
    last_name: 'Petit',
    phone: '+33 6 45 67 89 01',
    address: '321 Boulevard Haussmann, 75009 Paris',
    role: 'mechanic',
    is_active: true,
    created_at: '2024-02-15T12:00:00Z',
    updated_at: '2024-02-15T12:00:00Z'
  },
  {
    id: 'user_5',
    username: 'recep1',
    email: 'lucie.moreau@kwetugarage.com',
    first_name: 'Lucie',
    last_name: 'Moreau',
    phone: '+33 6 56 78 90 12',
    address: '654 Rue de Rivoli, 75004 Paris',
    role: 'receptionist',
    is_active: true,
    created_at: '2024-03-01T13:00:00Z',
    updated_at: '2024-03-01T13:00:00Z'
  },
  {
    id: 'user_6',
    username: 'mech3',
    email: 'thomas.robert@kwetugarage.com',
    first_name: 'Thomas',
    last_name: 'Robert',
    phone: '+33 6 67 89 01 23',
    address: '987 Rue Montmartre, 75018 Paris',
    role: 'mechanic',
    is_active: false,
    created_at: '2024-03-15T14:00:00Z',
    updated_at: '2024-03-15T14:00:00Z'
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = users.find(u => u.id === id)

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
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
    const userData = await request.json()
    const userIndex = users.findIndex(u => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Validation basique
    if (!userData.email || !userData.first_name || !userData.last_name) {
      return NextResponse.json(
        { error: 'L\'email, le prénom et le nom sont obligatoires' },
        { status: 400 }
      )
    }

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      return NextResponse.json(
        { error: 'L\'email n\'est pas valide' },
        { status: 400 }
      )
    }

    if (userData.password && userData.password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    // Vérifier si le nom d'utilisateur existe déjà (pour un autre utilisateur)
    if (userData.username && users.some(u => u.username === userData.username && u.id !== id)) {
      return NextResponse.json(
        { error: 'Ce nom d\'utilisateur existe déjà' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà (pour un autre utilisateur)
    if (userData.email && users.some(u => u.email === userData.email && u.id !== id)) {
      return NextResponse.json(
        { error: 'Cet email existe déjà' },
        { status: 400 }
      )
    }

    // Mettre à jour l'utilisateur
    const updatedUser: User = {
      ...users[userIndex],
      ...userData,
      updated_at: new Date().toISOString()
    }

    users[userIndex] = updatedUser

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
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
    const userIndex = users.findIndex(u => u.id === id)

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    const deletedUser = users[userIndex]
    users.splice(userIndex, 1)

    return NextResponse.json({ 
      message: 'Utilisateur supprimé avec succès',
      user: deletedUser 
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    )
  }
}
