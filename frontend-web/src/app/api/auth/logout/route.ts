import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Ici vous pourriez invalider le token dans une base de données
    // Pour l'instant, on retourne juste un succès
    return NextResponse.json({ message: 'Déconnexion réussie' })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
