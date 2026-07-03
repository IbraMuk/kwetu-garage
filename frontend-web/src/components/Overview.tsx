'use client'

import { useEffect, useState } from 'react'
import { Users, Car, Wrench, Package, DollarSign, TrendingUp } from 'lucide-react'
import api from '@/lib/api'

interface Stats {
  totalClients: number
  totalVehicles: number
  activeRepairs: number
  lowStockParts: number
  pendingInvoices: number
  monthlyRevenue: number
}

const statConfig = [
  {
    title: 'Total Clients',
    key: 'totalClients',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'hover:border-blue-200'
  },
  {
    title: 'Total Véhicules',
    key: 'totalVehicles',
    icon: Car,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'hover:border-emerald-200'
  },
  {
    title: 'Réparations Actives',
    key: 'activeRepairs',
    icon: Wrench,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'hover:border-blue-200'
  },
  {
    title: 'Pièces en Stock Faible',
    key: 'lowStockParts',
    icon: Package,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    borderColor: 'hover:border-red-200'
  },
  {
    title: 'Factures en Attente',
    key: 'pendingInvoices',
    icon: DollarSign,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderColor: 'hover:border-violet-200'
  },
  {
    title: 'Revenus Mensuel',
    key: 'monthlyRevenue',
    icon: TrendingUp,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'hover:border-blue-200',
    format: (v: number) => `${v.toLocaleString()} $`
  }
]

export default function Overview() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalVehicles: 0,
    activeRepairs: 0,
    lowStockParts: 0,
    pendingInvoices: 0,
    monthlyRevenue: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [clientsRes, vehiclesRes, repairsRes, partsRes, invoicesRes] = await Promise.all([
        api.get('/clients'),
        api.get('/vehicles'),
        api.get('/repairs'),
        api.get('/parts'),
        api.get('/invoices'),
      ])

      const clients = Array.isArray(clientsRes.data) ? clientsRes.data : []
      const vehicles = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : []
      const repairs = Array.isArray(repairsRes.data) ? repairsRes.data : []
      const parts = Array.isArray(partsRes.data) ? partsRes.data : []
      const invoices = Array.isArray(invoicesRes.data) ? invoicesRes.data : []

      setStats({
        totalClients: clients.length,
        totalVehicles: vehicles.length,
        activeRepairs: repairs.filter((r: { status?: string }) => r.status !== 'completed').length,
        lowStockParts: parts.filter(
          (p: { stock_quantity?: number; min_stock_level?: number }) =>
            (p.stock_quantity ?? 0) <= (p.min_stock_level ?? 0),
        ).length,
        pendingInvoices: invoices.filter((i: { status?: string }) => i.status === 'pending').length,
        monthlyRevenue: 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Vue d&apos;ensemble</h2>
        <p className="text-slate-500 mt-1">Statistiques de votre garage en temps réel</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statConfig.map((stat) => {
          const Icon = stat.icon
          const value = stats[stat.key as keyof Stats]
          const displayValue = stat.format && typeof value === 'number' 
            ? stat.format(value) 
            : value
          return (
            <div 
              key={stat.key} 
              className={`bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg ${stat.borderColor}`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-xl ${stat.iconBg}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-5 flex-1 min-w-0">
                  <dt className="text-sm font-medium text-slate-500 truncate">
                    {stat.title}
                  </dt>
                  <dd className="text-2xl font-bold text-slate-900 mt-1">
                    {displayValue}
                  </dd>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Réparations Récentes
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">Les dernières interventions</p>
          </div>
          <div className="p-8">
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <Wrench className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-slate-500">Aucune réparation récente</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Factures Récentes
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">Derniers documents émis</p>
          </div>
          <div className="p-8">
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <DollarSign className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-slate-500">Aucune facture récente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


