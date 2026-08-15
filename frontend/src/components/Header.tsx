'use client'

import { User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  user: any
}

export default function Header({ user }: HeaderProps) {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Tableau de bord
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Bienvenue, {user?.first_name} 👋
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 border border-slate-200 hover:border-slate-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

