'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Car, 
  Users, 
  Wrench, 
  DollarSign, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  User,
  FileText,
  Package,
  BarChart3,
  HelpCircle,
  Calendar
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Home, active: true },
    { name: 'Véhicules', href: '/vehicles', icon: Car, active: false },
    { name: 'Clients', href: '/clients', icon: Users, active: false },
    { name: 'Réparations', href: '/repairs', icon: Wrench, active: false },
    { name: 'Agenda', href: '/calendar', icon: Calendar, active: false },
    { name: 'Factures', href: '/invoices', icon: DollarSign, active: false },
    { name: 'Stock', href: '/inventory', icon: Package, active: false },
    { name: 'Paramètres', href: '/settings', icon: Settings, active: false }
  ]

  return (
    <nav className="navbar">
      <div className="px-6 py-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <img src="/logo.png" alt="Kwetu Garage" className="w-10 h-10 rounded-xl object-contain" />
                <div>
                  <span className="text-xl font-bold text-slate-100">Kwetu Garage</span>
                  <p className="text-xs text-slate-500">Système de gestion</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden ml-8 lg:flex lg:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${item.active ? 'active' : ''}`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="flex items-center space-x-3 px-3 py-2 bg-slate-800 rounded-lg">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-300">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-slate-500">Administrateur</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.active 
                    ? 'text-blue-400 bg-blue-500/5' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-slate-800">
            <div className="px-4 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-300">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <div className="text-base font-medium text-slate-200">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-sm text-slate-500">Administrateur</div>
                </div>
              </div>
            </div>
            <div className="mt-3 px-2">
              <button
                onClick={handleLogout}
                className="block w-full px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 mr-3" />
                  Déconnexion
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

