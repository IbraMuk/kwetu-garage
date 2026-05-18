'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar, { type TabType } from './Sidebar'
import Header from './Header'
import Overview from './Overview'
import ClientsList from './ClientsList'
import VehiclesList from './VehiclesList'
import RepairsList from './RepairsList'
import PartsList from './PartsList'
import InvoicesList from './InvoicesList'

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />
      case 'clients':
        return <ClientsList />
      case 'vehicles':
        return <VehiclesList />
      case 'repairs':
        return <RepairsList />
      case 'parts':
        return <PartsList />
      case 'invoices':
        return <InvoicesList />
      default:
        return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="lg:pl-72">
        <Header user={user} />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

