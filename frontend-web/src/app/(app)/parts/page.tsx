'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PartsPage() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page stock qui gère les pièces
    router.replace('/stock')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirection vers le stock...</p>
      </div>
    </div>
  )
}
